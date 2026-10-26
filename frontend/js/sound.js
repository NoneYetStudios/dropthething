/**
 * Drop The Thing - Adaptive Chiptune & Modern Physics Sound Engine (Expansion Pass)
 * Supports all 22 chaos effects in both Modern Mode and Retro 8-Bit Mode.
 */
(function (root) {
  'use strict';

  const STORAGE_KEY = 'dropthething_sound';
  let audioCtx = null;
  let soundEnabled = true;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  } catch (_) {
    soundEnabled = true;
  }

  function getContext() {
    if (!audioCtx && typeof window !== 'undefined') {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        audioCtx = new Ctx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function getMode() {
    if (typeof document !== 'undefined' && document.body.classList.contains('theme-retro')) {
      return 'retro';
    }
    try {
      return localStorage.getItem('dropthething_mode') || 'modern';
    } catch (_) {
      return 'modern';
    }
  }

  function playToneSequence(notes, waveType = 'square', volume = 0.12) {
    if (!soundEnabled) return;
    const ctx = getContext();
    if (!ctx) return;

    let t = ctx.currentTime;
    for (const [freq, dur, endFreq] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(Math.max(20, freq), t);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur);
      }
      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur * 0.88;
    }
  }

  function playNoiseBurst(duration = 0.25, filterFreq = 900, filterType = 'bandpass', volume = 0.18) {
    if (!soundEnabled) return;
    const ctx = getContext();
    if (!ctx) return;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    const isRetro = getMode() === 'retro';

    let lastSample = 0;
    for (let i = 0; i < bufferSize; i++) {
      if (isRetro && i % 6 !== 0) {
        data[i] = lastSample;
      } else {
        lastSample = Math.random() * 2 - 1;
        data[i] = lastSample;
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  function play(type, objectId = '') {
    if (!soundEnabled) return;
    const isRetro = getMode() === 'retro';
    const norm = String(type || '').toLowerCase();

    switch (norm) {
      case 'click':
        if (isRetro) {
          playToneSequence([[920, 0.035], [1240, 0.035]], 'square', 0.09);
        } else {
          playToneSequence([[620, 0.04, 780]], 'sine', 0.1);
        }
        break;

      case 'drop':
        if (isRetro) {
          playToneSequence([[780, 0.045], [640, 0.045], [500, 0.045], [360, 0.055]], 'square', 0.09);
        } else {
          playToneSequence([[820, 0.24, 240]], 'sine', 0.1);
        }
        break;

      case 'bounce':
      case 'mega_bounce':
      case 'spring_launch':
      case 'ricochet':
        if (objectId.includes('duck')) {
          playToneSequence([[980, 0.05, 1520], [1380, 0.06, 940]], isRetro ? 'square' : 'triangle', 0.12);
        } else if (norm === 'spring_launch' || norm === 'mega_bounce') {
          playToneSequence([[140, 0.06, 440], [320, 0.16, 980]], isRetro ? 'square' : 'sawtooth', 0.14);
        } else {
          playToneSequence([[170, 0.14, 540]], isRetro ? 'square' : 'triangle', 0.13);
        }
        break;

      case 'duck_storm':
      case 'duckified':
        playToneSequence(
          [[920, 0.05, 1480], [1120, 0.05, 1620], [860, 0.06, 1390], [1240, 0.08, 1760]],
          isRetro ? 'square' : 'triangle',
          0.13
        );
        break;

      case 'gold_burst':
        playToneSequence(
          [[987.77, 0.05], [1318.51, 0.06], [1567.98, 0.06], [2093.0, 0.14]],
          isRetro ? 'square' : 'sine',
          0.13
        );
        break;

      case 'portal':
      case 'anti_gravity':
      case 'moon_gravity':
        playToneSequence(
          [[320, 0.08, 640], [480, 0.08, 960], [640, 0.12, 420]],
          isRetro ? 'square' : 'sine',
          0.11
        );
        break;

      case 'black_hole':
        playNoiseBurst(0.45, 180, 'lowpass', 0.24);
        playToneSequence([[440, 0.38, 42]], 'sawtooth', 0.16);
        break;

      case 'glitch':
        playToneSequence(
          [[1480, 0.03], [220, 0.04], [1960, 0.03], [110, 0.05], [880, 0.04]],
          'square',
          0.13
        );
        break;

      case 'confetti':
        playToneSequence([[523.25, 0.05], [659.25, 0.05], [783.99, 0.05], [1046.5, 0.14]], isRetro ? 'square' : 'triangle', 0.12);
        break;

      case 'shatter':
      case 'fragment':
      case 'floor_crack':
        playNoiseBurst(0.24, 2100, 'highpass', 0.16);
        playToneSequence([[1600, 0.04, 820], [2100, 0.06, 640]], isRetro ? 'square' : 'sine', 0.11);
        break;

      case 'splatter':
        playNoiseBurst(0.26, 520, 'bandpass', 0.2);
        playToneSequence([[380, 0.09, 130], [260, 0.11, 95]], isRetro ? 'square' : 'sawtooth', 0.12);
        break;

      case 'explode':
      case 'chain_reaction':
      case 'rain_of_objects':
      case 'spawn_object':
      case 'multi_drop':
        playNoiseBurst(0.42, 240, 'lowpass', 0.25);
        playToneSequence([[150, 0.32, 38]], 'sawtooth', 0.17);
        break;

      case 'fanfare':
        playToneSequence(
          [[523.25, 0.06], [659.25, 0.06], [783.99, 0.06], [1046.5, 0.16]],
          isRetro ? 'square' : 'triangle',
          0.11
        );
        break;

      default:
        playToneSequence([[660, 0.04]], isRetro ? 'square' : 'sine', 0.08);
    }
  }

  function isEnabled() {
    return soundEnabled;
  }

  function setEnabled(enabled) {
    soundEnabled = Boolean(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, String(soundEnabled));
    } catch (_) {}
    if (soundEnabled) {
      play('click');
    }
    return soundEnabled;
  }

  function toggle() {
    return setEnabled(!soundEnabled);
  }

  root.DropSound = {
    play,
    isEnabled,
    setEnabled,
    toggle
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
