/**
 * Drop The Thing - Main Application & Paged Catalog Controller (Expansion Pass)
 * Features:
 * - Paged Catalog (12 objects per page, Previous/Next Page buttons, "Page X of Y" indicator)
 * - Session-shuffled catalog so opening the game immediately presents 12 random objects
 * - "Random Thing" button pulling from ALL 108 objects across the entire catalog
 * - Multi-effect inspector & Chaos Factor breakdown (Primary + Secondary Effects)
 * - Real-time Nickname input filtering ([A-Za-z0-9_]) with family-friendly profanity check
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    MODE: 'dropthething_mode',
    NICKNAME: 'dropthething_nickname',
    TOKEN: 'dropthething_player_token',
    LOCAL_LEADERBOARD: 'dropthething_local_leaderboard'
  };

  const OBJECTS_PER_PAGE = 12;

  // Build a freshly shuffled catalog of all 108 objects on every page load/refresh
  const catalogOrder = [...window.DropObjects.OBJECTS];
  function shuffleCatalogOrder() {
    const n = catalogOrder.length;
    const randBuf = (window.crypto && window.crypto.getRandomValues)
      ? window.crypto.getRandomValues(new Uint32Array(n))
      : null;
    for (let i = n - 1; i > 0; i--) {
      const j = randBuf
        ? (randBuf[i] % (i + 1))
        : Math.floor(Math.random() * (i + 1));
      const tmp = catalogOrder[i];
      catalogOrder[i] = catalogOrder[j];
      catalogOrder[j] = tmp;
    }
  }
  shuffleCatalogOrder();

  const totalPages = Math.max(1, Math.ceil(catalogOrder.length / OBJECTS_PER_PAGE));

  // State
  let currentMode = 'modern'; // 'modern' | 'retro'
  let currentPage = 1; // 1-based page index
  let selectedObject = catalogOrder[0];
  let lastDropResult = null;
  let sessionDrops = 0;
  let sessionBestScore = 0;
  let playerToken = '';
  let playerTokenHash = '';
  let physicsWorld = null;

  // DOM Elements
  const bodyEl = document.body;
  const btnModeModern = document.getElementById('btn-mode-modern');
  const btnModeRetro = document.getElementById('btn-mode-retro');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const btnRandomDrop = document.getElementById('btn-random-drop');
  const btnShuffleObject = document.getElementById('btn-shuffle-object');
  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');
  const pageIndicatorEl = document.getElementById('page-indicator');
  const btnDropMain = document.getElementById('btn-drop-main');
  const btnCleanFloor = document.getElementById('btn-clean-floor');
  const chkSlamBoost = document.getElementById('chk-slam-boost');

  const pickerGridEl = document.getElementById('object-picker-grid');
  const inspectorNameEl = document.getElementById('inspector-name');
  const inspectorEffectsListEl = document.getElementById('inspector-effects-list');
  const inspectorTaglineEl = document.getElementById('inspector-tagline');
  const inspectorWeightEl = document.getElementById('inspector-weight');
  const inspectorWeightModEl = document.getElementById('inspector-weight-mod');
  const inspectorFragilityEl = document.getElementById('inspector-fragility');
  const inspectorBreakBonusEl = document.getElementById('inspector-break-bonus');

  const tauntTextEl = document.getElementById('taunt-text');
  const sessionDropCountEl = document.getElementById('session-drop-count');
  const sessionBestScoreEl = document.getElementById('session-best-score');
  const sharedBannerEl = document.getElementById('shared-challenge-banner');
  const sharedBannerTextEl = document.getElementById('shared-challenge-text');
  const btnAcceptChallenge = document.getElementById('btn-accept-challenge');

  const canvasEl = document.getElementById('drop-canvas');
  const telemetryPillEl = document.getElementById('impact-telemetry-pill');
  const activeEffectsPanelEl = document.getElementById('active-effects-panel');
  const activeEffectsListEl = document.getElementById('active-effects-list');

  const scoreObjectBadgeEl = document.getElementById('score-object-badge');
  const goofyScoreEl = document.getElementById('goofy-score-display');
  const chaosFormulaEl = document.getElementById('chaos-formula-breakdown');
  const breakageStatusEl = document.getElementById('breakage-status-line');

  const btnShareDrop = document.getElementById('btn-share-drop');
  const shareUrlPreviewEl = document.getElementById('share-url-preview');
  const shareFeedbackEl = document.getElementById('share-feedback');

  const nicknameInputEl = document.getElementById('nickname-input');
  const btnRandomNickname = document.getElementById('btn-random-nickname');
  const btnSubmitScore = document.getElementById('btn-submit-score');

  const btnRefreshLeaderboard = document.getElementById('btn-refresh-leaderboard');
  const leaderboardTbodyEl = document.getElementById('leaderboard-tbody');

  async function initPlayerIdentity() {
    try {
      let tok = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!tok || !/^[A-Za-z0-9]{16,24}$/.test(tok)) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        tok = '';
        for (let i = 0; i < 20; i++) {
          tok += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        localStorage.setItem(STORAGE_KEYS.TOKEN, tok);
      }
      playerToken = tok;

      if (window.crypto && window.crypto.subtle) {
        const buf = new TextEncoder().encode(tok);
        const hashBuf = await window.crypto.subtle.digest('SHA-256', buf);
        playerTokenHash = Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      }
    } catch (_) {
      playerToken = 'DropPlayerToken12345';
    }

    try {
      const savedName = localStorage.getItem(STORAGE_KEYS.NICKNAME);
      if (savedName && window.ProfanityFilter.validateNickname(savedName).valid) {
        nicknameInputEl.value = savedName;
      } else {
        const generated = window.ProfanityFilter.generateNickname();
        nicknameInputEl.value = generated;
        localStorage.setItem(STORAGE_KEYS.NICKNAME, generated);
      }
    } catch (_) {
      nicknameInputEl.value = 'GravityChamp';
    }
  }

  function getApiCandidates(route) {
    const cleanRoute = route.replace(/^\/+/, '');
    const isDropSubpath = window.location.pathname.startsWith('/drop');
    if (isDropSubpath) {
      return [`/drop/api/${cleanRoute}`, `/api/${cleanRoute}`];
    }
    return [`/api/${cleanRoute}`, `/drop/api/${cleanRoute}`];
  }

  async function apiRequest(route, options = {}) {
    const urls = getApiCandidates(route);
    let lastErr = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          ...options
        });
        const data = await res.json();
        if (res.ok || (data && data.code)) {
          return { status: res.status, ok: res.ok, data };
        }
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('API request failed');
  }

  function getEffectBadgeClass(effectId) {
    const map = {
      SPLATTER: 'effect-splatter',
      SHATTER: 'effect-shatter',
      BOUNCE: 'effect-bounce',
      MEGA_BOUNCE: 'effect-bounce',
      SPRING_LAUNCH: 'effect-bounce',
      RICOCHET: 'effect-bounce',
      EXPLODE: 'effect-explode',
      CHAIN_REACTION: 'effect-explode'
    };
    return map[effectId] || 'effect-special';
  }

  function setVisualMode(mode, playClick = false) {
    currentMode = mode === 'retro' ? 'retro' : 'modern';
    bodyEl.classList.remove('theme-modern', 'theme-retro');
    bodyEl.classList.add(currentMode === 'retro' ? 'theme-retro' : 'theme-modern');

    btnModeModern.classList.toggle('active', currentMode === 'modern');
    btnModeRetro.classList.toggle('active', currentMode === 'retro');

    try {
      localStorage.setItem(STORAGE_KEYS.MODE, currentMode);
    } catch (_) {}

    renderObjectPickerPage();
    if (physicsWorld) {
      physicsWorld.setMode(currentMode);
    }
    if (playClick && window.DropSound) {
      window.DropSound.play('click');
    }
  }

  /**
   * Return the 12 objects for the current page (1..totalPages).
   */
  function getObjectsForPage(pageNumber) {
    const startIdx = (pageNumber - 1) * OBJECTS_PER_PAGE;
    return catalogOrder.slice(startIdx, startIdx + OBJECTS_PER_PAGE);
  }

  /**
   * Render the current page of 12 objects and update the "Page X of Y" indicator.
   */
  function renderObjectPickerPage() {
    if (!pickerGridEl) return;
    pickerGridEl.innerHTML = '';

    const pageItems = getObjectsForPage(currentPage);

    for (const obj of pageItems) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'object-card' + (selectedObject.id === obj.id ? ' selected' : '');
      card.setAttribute('role', 'option');
      card.setAttribute('aria-selected', selectedObject.id === obj.id ? 'true' : 'false');
      card.dataset.objectId = obj.id;

      const svgArt = window.DropObjects.getObjectSvg(obj.id, currentMode);
      const extraCount = Array.isArray(obj.secondaryEffects) ? obj.secondaryEffects.length : 0;
      const primaryLabel = obj.primaryEffect.replace(/_/g, ' ');
      const badgeText = extraCount > 0 ? `${primaryLabel} +${extraCount}` : primaryLabel;
      const badgeClass = getEffectBadgeClass(obj.primaryEffect);

      card.innerHTML = `
        <div class="object-art-thumb" aria-hidden="true">${svgArt}</div>
        <div class="object-card-name">${obj.name}</div>
        <div class="object-stats-row">
          <span class="stat-chip">${obj.weight} ${obj.weightUnit}</span>
          <span class="stat-chip">Frag: ${obj.fragility}</span>
        </div>
        <span class="effect-badge ${badgeClass}">${badgeText}</span>
      `;

      card.addEventListener('click', () => {
        selectObject(obj.id, true, false);
      });

      pickerGridEl.appendChild(card);
    }

    if (pageIndicatorEl) {
      pageIndicatorEl.textContent = `Page ${currentPage} of ${totalPages}`;
    }
  }

  /**
   * Navigate to a specific catalog page (wraps cleanly between 1 and totalPages).
   */
  function goToPage(targetPage, playSound = true) {
    if (targetPage < 1) {
      currentPage = totalPages;
    } else if (targetPage > totalPages) {
      currentPage = 1;
    } else {
      currentPage = targetPage;
    }

    renderObjectPickerPage();
    if (playSound && window.DropSound) {
      window.DropSound.play('click');
    }
  }

  /**
   * Select any object in the 108-object catalog.
   * If jumpToPage is true, automatically flips to the page containing that object.
   */
  function selectObject(objectId, playSound = false, jumpToPage = true) {
    const obj = window.DropObjects.getObjectById(objectId);
    if (!obj) return;
    selectedObject = obj;

    if (jumpToPage) {
      const idx = catalogOrder.findIndex((item) => item.id === obj.id);
      if (idx !== -1) {
        const objPage = Math.floor(idx / OBJECTS_PER_PAGE) + 1;
        if (objPage !== currentPage) {
          currentPage = objPage;
        }
      }
    }

    renderObjectPickerPage();

    if (playSound && window.DropSound) {
      window.DropSound.play('click');
    }

    // Update Inspector with Primary + Secondary Effects
    inspectorNameEl.textContent = `${obj.emoji} ${obj.name}`;
    if (inspectorEffectsListEl) {
      inspectorEffectsListEl.innerHTML = '';
      for (const eff of obj.allEffects) {
        const span = document.createElement('span');
        span.className = `effect-badge ${getEffectBadgeClass(eff)}`;
        span.textContent = eff.replace(/_/g, ' ');
        inspectorEffectsListEl.appendChild(span);
      }
    }
    inspectorTaglineEl.textContent = obj.tagline;
    inspectorWeightEl.textContent = `${obj.weight} ${obj.weightUnit}`;
    inspectorWeightModEl.textContent = String(obj.weightModifier);
    inspectorFragilityEl.textContent = String(obj.fragility);
    inspectorBreakBonusEl.textContent = String(obj.breakageBonus);

    btnDropMain.textContent = `☄️ DROP THE ${obj.shortName.toUpperCase()}! (SPACE)`;

    const previewScore = lastDropResult && lastDropResult.objectId === obj.id ? lastDropResult.score : 0;
    updateSharePreview(obj.id, previewScore);
  }

  /**
   * Pick a surprise random object from ALL objects in the catalog and drop it!
   */
  function selectAndDropRandomFromAllCatalog() {
    const rnd = window.DropObjects.getRandomObject();
    selectObject(rnd.id, false, true);
    triggerDrop();
  }

  function triggerDrop(customX = null) {
    if (!physicsWorld) return;
    physicsWorld.setSlamBoost(Boolean(chkSlamBoost && chkSlamBoost.checked));
    physicsWorld.dropObject(selectedObject.id, customX);
  }

  function animateGoofyScore(targetScore) {
    goofyScoreEl.classList.remove('goofy-score-pop');
    void goofyScoreEl.offsetWidth;
    goofyScoreEl.classList.add('goofy-score-pop');

    const startScore = Number(goofyScoreEl.textContent.replace(/[^0-9]/g, '')) || 0;
    const durationMs = 380;
    const startTime = performance.now();

    function stepCounter(now) {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(startScore + (targetScore - startScore) * eased);
      goofyScoreEl.textContent = val.toLocaleString();
      if (t < 1) {
        requestAnimationFrame(stepCounter);
      } else {
        goofyScoreEl.textContent = targetScore.toLocaleString();
      }
    }

    requestAnimationFrame(stepCounter);
  }

  function updateSharePreview(objectId, score) {
    const sharePath = window.DropObjects.buildSharePath(objectId, score);
    shareUrlPreviewEl.textContent = sharePath;
  }

  /**
   * Render Active Chaos Environmental Effects panel near the Drop Zone.
   * Displays only active effects; hides panel when no effects exist.
   */
  function renderActiveEffectsPanel(activeEffects = [], eventInfo = null) {
    if (activeEffectsPanelEl && activeEffectsListEl) {
      if (!Array.isArray(activeEffects) || activeEffects.length === 0) {
        activeEffectsPanelEl.classList.add('hidden');
        activeEffectsListEl.innerHTML = '';
      } else {
        activeEffectsPanelEl.classList.remove('hidden');
        activeEffectsListEl.innerHTML = '';

        for (const eff of activeEffects) {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'active-effect-item';

          const strengthPct = Math.round((eff.strength || 0) * 100);
          const strengthLine = eff.showStrength
            ? `<div class="active-effect-meta">Strength: ${strengthPct}%</div>`
            : '';

          itemDiv.innerHTML = `
            <div class="active-effect-title">${eff.icon} ${eff.name}</div>
            ${strengthLine}
            <div class="active-effect-meta">Remaining Drops: ${eff.remainingDrops}</div>
          `;
          activeEffectsListEl.appendChild(itemDiv);
        }
      }
    }

    if (eventInfo) {
      if (eventInfo.type === 'activated') {
        telemetryPillEl.textContent = `${eventInfo.icon} ${eventInfo.title} • ${eventInfo.detail}`;
        tauntTextEl.textContent = `“${eventInfo.title}: ${eventInfo.detail}”`;
        if (window.DropSound && eventInfo.effectId === 'antiGravity') {
          window.DropSound.play('anti_gravity');
        }
      } else if (eventInfo.type === 'collapsed' && Array.isArray(eventInfo.collapsed) && eventInfo.collapsed.length > 0) {
        const msg = eventInfo.collapsed.map((c) => c.message).join(' • ');
        telemetryPillEl.textContent = msg;
      } else if (eventInfo.type === 'cleared') {
        telemetryPillEl.textContent = 'CHAOS CLEARED • Reality reluctantly restored.';
        tauntTextEl.textContent = '“CHAOS CLEARED — Reality reluctantly restored.”';
      }
    }
  }

  function handlePhysicsImpact(result) {
    lastDropResult = result;
    sessionDrops += 1;
    if (result.score > sessionBestScore) {
      sessionBestScore = result.score;
    }

    sessionDropCountEl.textContent = String(sessionDrops);
    sessionBestScoreEl.textContent = sessionBestScore.toLocaleString();

    if (window.DropSound) {
      window.DropSound.play(result.primaryEffect.toLowerCase(), result.objectId);
    }

    animateGoofyScore(result.score);

    const effectsChain = (result.allEffects || [result.primaryEffect]).join(' + ');
    scoreObjectBadgeEl.textContent = `${selectedObject.emoji} ${result.objectName}`;
    chaosFormulaEl.textContent =
      `(${result.impactForce} Impact × ${result.weightModifier} Wt) + ` +
      `${result.breakageBonus} Break + ${result.specialEffectBonus} [${effectsChain}] = ${result.score.toLocaleString()} CHAOS`;

    if (result.didBreak) {
      breakageStatusEl.innerHTML =
        `💥 <strong>BROKEN!</strong> Fragility (${result.fragility}) &lt; Impact (${result.impactForce}) → <strong>${effectsChain}</strong>!`;
    } else {
      breakageStatusEl.innerHTML =
        `🛡️ <strong>SURVIVED!</strong> Fragility (${result.fragility}) ≥ Impact (${result.impactForce}) → <strong>${effectsChain}</strong>!`;
    }

    telemetryPillEl.textContent = `Impact: ${result.impactForce}N • ${effectsChain} • Chaos: ${result.score.toLocaleString()}`;
    tauntTextEl.textContent = `“${result.taunt}”`;

    updateSharePreview(result.objectId, result.score);
  }

  function checkSharedUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const sharedObjId = params.get('object');
    const sharedScoreRaw = params.get('score');

    if (sharedObjId) {
      const obj = window.DropObjects.getObjectById(sharedObjId);
      if (obj) {
        selectObject(obj.id, false, true);
        const sharedScore = Math.max(0, Math.round(Number(sharedScoreRaw) || 0));
        if (sharedScore > 0) {
          sharedBannerEl.classList.remove('hidden');
          sharedBannerTextEl.textContent =
            `🎯 Shared Drop Challenge: Someone dropped ${obj.name.toUpperCase()} for ${sharedScore.toLocaleString()} CHAOS! Can you beat it?`;
          updateSharePreview(obj.id, sharedScore);
        }
      }
    }
  }

  async function handleShareClick() {
    const objId = lastDropResult ? lastDropResult.objectId : selectedObject.id;
    const score = lastDropResult ? lastDropResult.score : 0;
    const sharePath = window.DropObjects.buildSharePath(objId, score);
    const fullUrl = `${window.location.origin}${sharePath}`;

    updateSharePreview(objId, score);

    try {
      const newUrl = `${window.location.pathname}?object=${encodeURIComponent(objId)}&score=${encodeURIComponent(score)}`;
      window.history.replaceState({}, '', newUrl);
    } catch (_) {}

    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
        copied = true;
      }
    } catch (_) {}

    shareFeedbackEl.classList.remove('hidden');
    shareFeedbackEl.textContent = copied
      ? `✅ Copied ${sharePath} to clipboard!`
      : `🔗 Share link ready: ${sharePath}`;

    if (window.DropSound) {
      window.DropSound.play('click');
    }

    setTimeout(() => {
      shareFeedbackEl.classList.add('hidden');
    }, 4000);
  }

  /**
   * Filter nickname input in real-time so only letters, numbers, and underscores are allowed.
   */
  function filterNicknameInput() {
    if (!nicknameInputEl) return;
    const original = nicknameInputEl.value;
    const filtered = original.replace(/[^A-Za-z0-9_]/g, '');
    if (original !== filtered) {
      nicknameInputEl.value = filtered;
    }
  }

  /**
   * Validate nickname input using Lemonade Stand's ProfanityFilter.
   * Only letters, numbers, and underscores are allowed, and family-friendly filter is enforced.
   */
  function validateCurrentNickname(showSubmitError = false) {
    filterNicknameInput();
    const raw = nicknameInputEl.value || '';
    const check = window.ProfanityFilter.validateNickname(raw);
    if (!check.valid) {
      if (showSubmitError && check.reason) {
        if (typeof nicknameInputEl.setCustomValidity === 'function') {
          nicknameInputEl.setCustomValidity(check.reason);
          if (typeof nicknameInputEl.reportValidity === 'function') {
            nicknameInputEl.reportValidity();
          }
        }
      }
      return null;
    }
    if (typeof nicknameInputEl.setCustomValidity === 'function') {
      nicknameInputEl.setCustomValidity('');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.NICKNAME, check.sanitized);
    } catch (_) {}
    return check.sanitized;
  }

  function getLocalFallbackLeaderboard() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_LEADERBOARD);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}

    return [
      { nickname: 'UltimateYeeter', object_id: 'ultimate_thing', score: 2480, mode: 'modern' },
      { nickname: 'DuckEmperor', object_id: 'rubber_duck_emperor', score: 1640, mode: 'modern' },
      { nickname: 'VaultBreaker', object_id: 'safe', score: 1320, mode: 'retro' },
      { nickname: 'GravityChamp', object_id: 'piano', score: 842, mode: 'modern' },
      { nickname: 'SirIsaacNewton', object_id: 'anvil', score: 798, mode: 'retro' },
      { nickname: 'GallagherFan', object_id: 'mystery_box', score: 735, mode: 'modern' },
      { nickname: 'SplatMaster', object_id: 'giant_egg', score: 612, mode: 'modern' },
      { nickname: 'TubeSmasher', object_id: 'tv', score: 590, mode: 'retro' },
      { nickname: 'ToastLauncher', object_id: 'toaster', score: 502, mode: 'modern' },
      { nickname: 'GourdCrusher', object_id: 'pumpkin', score: 468, mode: 'modern' },
      { nickname: 'MelonYeeter', object_id: 'watermelon', score: 455, mode: 'retro' },
      { nickname: 'DuckBouncer', object_id: 'rubber_duck', score: 292, mode: 'modern' }
    ];
  }

  function renderLeaderboardRows(entries) {
    if (!leaderboardTbodyEl) return;
    leaderboardTbodyEl.innerHTML = '';

    if (!Array.isArray(entries) || entries.length === 0) {
      leaderboardTbodyEl.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 1.2rem;">No chaos scores yet. Be the first!</td>
        </tr>
      `;
      return;
    }

    const top50 = entries.slice(0, 50);
    top50.forEach((row, index) => {
      const tr = document.createElement('tr');
      const obj = window.DropObjects.getObjectById(row.object_id || row.object) || window.DropObjects.OBJECTS[0];
      const isMe =
        (playerTokenHash && row.player_token === playerTokenHash) ||
        (row.isLocalPlayer === true);

      if (isMe) {
        tr.classList.add('is-player-row');
      }

      const rank = row.rank || index + 1;
      const safeName = String(row.nickname || 'Anonymous').replace(/[<>&"']/g, '');
      const scoreVal = Number(row.score || 0).toLocaleString();

      tr.innerHTML = `
        <td>#${rank}</td>
        <td>
          <span>${safeName}</span>
          ${isMe ? '<span class="you-tag">YOU</span>' : ''}
        </td>
        <td>${obj.emoji} ${obj.shortName}</td>
        <td style="text-align: right; font-weight: 900;">${scoreVal}</td>
      `;
      leaderboardTbodyEl.appendChild(tr);
    });
  }

  async function fetchLeaderboard() {
    try {
      const res = await apiRequest('leaderboard?limit=50', { method: 'GET' });
      if (res.ok && res.data && Array.isArray(res.data.entries)) {
        renderLeaderboardRows(res.data.entries);
        return;
      }
    } catch (_) {}

    renderLeaderboardRows(getLocalFallbackLeaderboard());
  }

  function flashSubmitButton(text, isError = false) {
    if (!btnSubmitScore) return;
    const orig = '🏆 Post Score';
    btnSubmitScore.textContent = text;
    btnSubmitScore.style.background = isError ? '#ef4444' : '#22c55e';
    btnSubmitScore.style.color = '#ffffff';
    setTimeout(() => {
      btnSubmitScore.textContent = orig;
      btnSubmitScore.style.background = '';
      btnSubmitScore.style.color = '';
    }, 2200);
  }

  async function submitScoreToLeaderboard() {
    const cleanNickname = validateCurrentNickname(true);
    if (!cleanNickname) {
      if (window.DropSound) window.DropSound.play('click');
      return;
    }

    if (!lastDropResult) {
      triggerDrop();
      flashSubmitButton('☄️ Dropping first!');
      return;
    }

    const payload = {
      nickname: cleanNickname,
      object_id: lastDropResult.objectId,
      score: lastDropResult.score,
      impact_force: lastDropResult.impactForce,
      did_break: lastDropResult.didBreak,
      special_effect: lastDropResult.specialEffect,
      mode: currentMode,
      player_token: playerToken
    };

    try {
      const res = await apiRequest('leaderboard', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        flashSubmitButton('❌ Could not post', true);
        return;
      }

      if (window.DropSound) {
        window.DropSound.play('fanfare');
      }
      flashSubmitButton('✅ Posted!');
      await fetchLeaderboard();
    } catch (_) {
      const list = getLocalFallbackLeaderboard();
      list.push({
        nickname: cleanNickname,
        object_id: lastDropResult.objectId,
        score: lastDropResult.score,
        mode: currentMode,
        isLocalPlayer: true
      });
      list.sort((a, b) => b.score - a.score);
      const top50 = list.slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEYS.LOCAL_LEADERBOARD, JSON.stringify(top50));
      } catch (_e) {}
      renderLeaderboardRows(top50);
      if (window.DropSound) {
        window.DropSound.play('fanfare');
      }
      flashSubmitButton('✅ Saved!');
    }
  }

  async function init() {
    await initPlayerIdentity();

    try {
      const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
      if (savedMode === 'retro' || savedMode === 'modern') {
        currentMode = savedMode;
      }
    } catch (_) {}

    physicsWorld = new window.DropPhysics.DropWorld(canvasEl, {
      onDropStart(obj) {
        if (window.DropSound) {
          window.DropSound.play('drop', obj.id);
        }
        const gravPct = physicsWorld ? Math.round(physicsWorld.getGravityMultiplier() * 100) : 100;
        const gravTag = gravPct !== 100 ? ` [Gravity: ${gravPct}% normal]` : '';
        telemetryPillEl.textContent = `Dropping ${obj.name} (${obj.weight} ${obj.weightUnit})${gravTag}...`;
      },
      onImpact(result) {
        handlePhysicsImpact(result);
      },
      onBounce(obj) {
        if (window.DropSound) {
          window.DropSound.play('bounce', obj.id);
        }
      },
      onEnvironmentalEffectsChange(activeEffects, eventInfo) {
        renderActiveEffectsPanel(activeEffects, eventInfo);
      }
    });

    setVisualMode(currentMode, false);
    selectObject(selectedObject.id, false, false);
    checkSharedUrlParams();

    function syncSoundBtn() {
      const on = window.DropSound ? window.DropSound.isEnabled() : true;
      btnSoundToggle.textContent = on ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    }
    syncSoundBtn();

    btnSoundToggle.addEventListener('click', () => {
      if (window.DropSound) {
        window.DropSound.toggle();
        syncSoundBtn();
      }
    });

    btnModeModern.addEventListener('click', () => setVisualMode('modern', true));
    btnModeRetro.addEventListener('click', () => setVisualMode('retro', true));

    // Paging Buttons (12 Objects Per Page)
    if (btnPrevPage) {
      btnPrevPage.addEventListener('click', () => goToPage(currentPage - 1, true));
    }
    if (btnNextPage) {
      btnNextPage.addEventListener('click', () => goToPage(currentPage + 1, true));
    }

    // Drop & Random Thing Buttons (pulls from ALL 108 objects in the catalog!)
    btnDropMain.addEventListener('click', () => triggerDrop());
    btnRandomDrop.addEventListener('click', () => selectAndDropRandomFromAllCatalog());
    btnShuffleObject.addEventListener('click', () => selectAndDropRandomFromAllCatalog());

    btnCleanFloor.addEventListener('click', () => {
      if (physicsWorld) physicsWorld.clearMess(true);
      if (window.DropSound) window.DropSound.play('click');
    });

    if (btnAcceptChallenge) {
      btnAcceptChallenge.addEventListener('click', () => {
        sharedBannerEl.classList.add('hidden');
        triggerDrop();
      });
    }

    canvasEl.addEventListener('pointerdown', (e) => {
      const rect = canvasEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const spawnX = physicsWorld.width * 0.5 * 0.7 + clickX * 0.3;
      triggerDrop(spawnX);
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement !== nicknameInputEl) {
        e.preventDefault();
        triggerDrop();
      }
    });

    window.addEventListener('resize', () => {
      if (physicsWorld) physicsWorld.resize();
    });

    btnShareDrop.addEventListener('click', handleShareClick);

    // Nickname input & Random Nickname generator (only letters, numbers, and underscores allowed)
    nicknameInputEl.addEventListener('input', () => {
      filterNicknameInput();
      validateCurrentNickname();
    });
    nicknameInputEl.addEventListener('paste', () => {
      setTimeout(() => {
        filterNicknameInput();
        validateCurrentNickname();
      }, 0);
    });

    btnRandomNickname.addEventListener('click', () => {
      const generated = window.ProfanityFilter.generateNickname();
      nicknameInputEl.value = generated;
      filterNicknameInput();
      validateCurrentNickname();
      if (window.DropSound) window.DropSound.play('click');
    });

    btnSubmitScore.addEventListener('click', submitScoreToLeaderboard);
    btnRefreshLeaderboard.addEventListener('click', () => {
      if (window.DropSound) window.DropSound.play('click');
      fetchLeaderboard();
    });

    await fetchLeaderboard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
