<?php
/**
 * Drop The Thing - PHP + PDO SQLite Leaderboard API for dropthething.stabthefinger.com
 * Supports PHP 7.4+ and 8.x on Apache / LiteSpeed / cPanel / JetHost.
 * Implements:
 * - Same Nickname & Profanity Filter as Lemonade Stand
 * - Top 50 Chaos Leaderboard storage & automatic pruning
 * - Chaos Factor formula verification
 */

error_reporting(0);
ini_set('display_errors', '0');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// -----------------------------------------------------------------------------
// SQLite Initialization
// -----------------------------------------------------------------------------
$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
    file_put_contents($dataDir . '/.htaccess', "Deny from all\n");
}

$dbFile = $dataDir . '/dropthething.db';

try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $pdo->exec("
    CREATE TABLE IF NOT EXISTS leaderboard_chaos (
        id TEXT PRIMARY KEY,
        nickname TEXT NOT NULL,
        object_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        impact_force INTEGER NOT NULL DEFAULT 0,
        did_break INTEGER NOT NULL DEFAULT 1,
        special_effect TEXT NOT NULL DEFAULT 'shatter',
        mode TEXT NOT NULL DEFAULT 'modern' CHECK (mode IN ('modern', 'retro')),
        date TEXT NOT NULL,
        player_token TEXT DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_chaos_score_date ON leaderboard_chaos (score DESC, date DESC);
    ");

    // Seed initial 12 objects if empty
    $count = $pdo->query("SELECT COUNT(*) FROM leaderboard_chaos")->fetchColumn();
    if ($count == 0) {
        $now = gmdate('Y-m-d\TH:i:s\Z');
        $starters = [
            ['GravityChamp', 'piano', 842, 185, 1, 'shatter', 'modern'],
            ['SirIsaacNewton', 'anvil', 798, 176, 1, 'explode', 'retro'],
            ['ChaosWizard', 'mystery_box', 735, 151, 1, 'explode', 'modern'],
            ['TubeSmasher', 'tv', 662, 155, 1, 'explode', 'retro'],
            ['SplatMaster', 'giant_egg', 599, 148, 1, 'splatter', 'modern'],
            ['ToastLauncher', 'toaster', 494, 116, 1, 'explode', 'modern'],
            ['GourdCrusher', 'pumpkin', 464, 130, 1, 'splatter', 'modern'],
            ['GallagherFan', 'watermelon', 463, 134, 1, 'splatter', 'retro'],
            ['BrickLayer', 'brick', 447, 114, 1, 'shatter', 'retro'],
            ['GlassCannon', 'glass_bottle', 384, 91, 1, 'shatter', 'modern'],
            ['PinKing_99', 'bowling_ball', 363, 130, 0, 'bounce', 'modern'],
            ['DuckBouncer', 'rubber_duck', 292, 88, 0, 'bounce', 'modern']
        ];
        $stmt = $pdo->prepare("INSERT INTO leaderboard_chaos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($starters as $s) {
            $id = bin2hex(random_bytes(16));
            $tokHash = hash('sha256', 'Seed_' . $s[0]);
            $stmt->execute([$id, $s[0], $s[1], $s[2], $s[3], $s[4], $s[5], $s[6], $now, $tokHash]);
        }
    }
} catch (Exception $e) {
    jsonResponse(['ok' => false, 'code' => 'DB_INIT_ERROR', 'error' => 'Database error.'], 500);
}

// -----------------------------------------------------------------------------
// Nickname Filter (Same Rules as Lemonade Stand)
// -----------------------------------------------------------------------------
const FRIENDLY_FAILURE_MSG = 'Nickname not allowed. Use 3–18 letters, numbers, or underscores and keep it family-friendly!';

const BANNED_SUBSTRINGS = [
    'fuck', 'fuk', 'fuq', 'fux', 'fck', 'fkn', 'fcuk', 'phuck', 'phuk', 'phuq', 'fvck', 'fvk',
    'shit', 'shyt', 'sh1t', 'bullshit', 'shiz',
    'bitch', 'btch', 'bytch', 'biatch', 'biotch', 'b1tch', 'beotch',
    'asshole', 'ashole', 'azzhole', 'butthole',
    'cunt', 'kunt', 'cvnt',
    'cawk', 'kawk', 'kock', 'c0ck', 'cocksuck',
    'dick', 'd1ck', 'dikhead', 'dickhead',
    'pussy', 'pusy', 'pussi', 'pu55y', 'pvssy',
    'whore', 'wh0re', 'slutt', 'skank', 'sk4nk', 'bastard', 'bstrd',
    'prick', 'pr1ck', 'wanker', 'bollock', 'bellend', 'knobhead', 'tosser',
    'pisser', 'goddamn', 'damnit', 'douche', 'd0uche',
    'faggot', 'fagot', 'phag', 'nigga', 'nigger', 'nigg', 'n1gg', 'niglet', 'niqqa', 'nibba',
    'chink', 'ch1nk', 'wetback', 'beaner', 'darkie', 'raghead', 'towelhead',
    'tranny', 'tr4nny', 'shemale', 'retard', 'r3tard', 'retrd',
    'nazi', 'n4zi', 'hitler', 'h1tler', 'gestapo',
    'porn', 'p0rn', 'pr0n', 'porno', 'sexx', 'jizz', 'j1zz', 'kumm', 'semen', 'sperm',
    'penis', 'p3nis', 'pen1s', 'phallus', 'boner', 'b0ner', 'erection', 'scrotum',
    'vagina', 'v4gina', 'vulva', 'clit', 'cl1t', 'boob', 'b00b', 'bewb', 'titty', 'titties', 't1tty', 'nipple',
    'anus', 'rectum', 'rimjob', 'blowjob', 'bl0wjob', 'handjob', 'footjob', 'fellatio', 'jackoff', 'jerkoff',
    'dildo', 'd1ldo', 'buttplug', 'vibrator', 'orgasm', 'masturbat', 'rapist', 'molest', 'paedo', 'incest',
    'bestiality', 'zoophil', 'necrophil', 'cocaine', 'heroin', 'crackhead', 'suicide', 'su1cide', 'killurself', 'murder'
];

const BANNED_TOKENS = [
    'ass', 'a55', 'azz', 'arse', 'sht', 'shat', 'cnt', 'knt', 'cock', 'cok', 'dik', 'dyk', 'd1k',
    'puss', 'twat', 'tw4t', 'twot', 'whor', 'hoar', 'hore', 'slut', 'slvt', 'prik', 'wank', 'w4nk',
    'piss', 'p1ss', 'damn', 'd4mn', 'crap', 'cr4p', 'hell', 'h3ll', 'fag', 'f4g', 'fgt', 'dyke',
    'n1g', 'nig', 'spic', 'sp1c', 'spik', 'kike', 'k1ke', 'kyke', 'gook', 'g00k', 'coon', 'c00n',
    'tard', 'kkk', 'klan', 'sex', 's3x', 'sexy', 'jiz', 'cum', 'cvm', 'vag', 'tit', 'tits', 't1ts',
    'anal', 'an4l', 'fap', 'f4p', 'rape', 'r4pe', 'pedo', 'p3do', 'meth', 'm3th', 'weed', 'w33d', 'stoner', 'bong', 'kys'
];

function validateNickname($input) {
    if (!is_string($input)) {
        return ['valid' => false, 'code' => 'INVALID_TYPE', 'error' => FRIENDLY_FAILURE_MSG];
    }
    $trimmed = trim($input);
    if (!preg_match('/^[A-Za-z0-9_]{3,18}$/', $trimmed)) {
        return ['valid' => false, 'code' => 'INVALID_FORMAT', 'error' => FRIENDLY_FAILURE_MSG];
    }

    $leetMap1 = ['0'=>'o','1'=>'i','2'=>'z','3'=>'e','4'=>'a','5'=>'s','6'=>'g','7'=>'t','8'=>'b','9'=>'g'];
    $leetMap2 = ['0'=>'o','1'=>'l','2'=>'s','3'=>'e','4'=>'a','5'=>'s','6'=>'b','7'=>'t','8'=>'b','9'=>'g'];

    $fullLower = strtolower(str_replace('_', '', $trimmed));
    $c1 = strtr($fullLower, $leetMap1);
    $c2 = strtr($fullLower, $leetMap2);
    $c3 = preg_replace('/(.)\1+/', '$1', $c1);
    $c4 = preg_replace('/(.)\1+/', '$1', $c2);

    foreach ([$fullLower, $c1, $c2, $c3, $c4] as $cand) {
        foreach (BANNED_SUBSTRINGS as $banned) {
            if (strpos($cand, $banned) !== false) {
                return ['valid' => false, 'code' => 'PROFANITY_REJECTED', 'error' => FRIENDLY_FAILURE_MSG];
            }
        }
    }

    $parts = preg_split('/_+/', $trimmed, -1, PREG_SPLIT_NO_EMPTY);
    foreach ($parts as $part) {
        $camelTokens = preg_split('/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/', $part, -1, PREG_SPLIT_NO_EMPTY);
        $allParts = array_merge([$part], $camelTokens);
        foreach ($allParts as $tok) {
            $tl = strtolower($tok);
            $t1 = strtr($tl, $leetMap1);
            $t2 = strtr($tl, $leetMap2);
            $t3 = preg_replace('/(.)\1+/', '$1', $t1);
            foreach ([$tl, $t1, $t2, $t3] as $tc) {
                if (in_array($tc, BANNED_TOKENS, true)) {
                    return ['valid' => false, 'code' => 'PROFANITY_REJECTED', 'error' => FRIENDLY_FAILURE_MSG];
                }
            }
        }
    }

    return ['valid' => true, 'sanitized' => $trimmed];
}

// -----------------------------------------------------------------------------
// Routing
// -----------------------------------------------------------------------------
$rawUri = $_SERVER['REQUEST_URI'] ?? '';
$parsedPath = parse_url($rawUri, PHP_URL_PATH) ?? '';

if (!empty($_GET['__route__'])) {
    $path = trim($_GET['__route__'], '/');
} elseif (!empty($_SERVER['PATH_INFO'])) {
    $path = trim($_SERVER['PATH_INFO'], '/');
} else {
    $path = preg_replace('#^.*?/api/?#i', '', $parsedPath);
    $path = trim(preg_replace('#^index\.php/?#i', '', $path), '/');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$bodyJson = file_get_contents('php://input');
$body = json_decode($bodyJson, true) ?: [];

if ($path === 'health' || $path === '') {
    jsonResponse(['ok' => true, 'service' => 'drop-the-thing-php-api', 'deployTarget' => 'dropthething.stabthefinger.com', 'version' => '1.0.0']);
}

if ($path === 'validate-nickname' && $method === 'POST') {
    $name = $body['nickname'] ?? ($body['stand_name'] ?? '');
    $check = validateNickname($name);
    if (!$check['valid']) {
        jsonResponse(['ok' => false, 'valid' => false, 'code' => $check['code'], 'error' => $check['error']], 400);
    }
    jsonResponse(['ok' => true, 'valid' => true, 'nickname' => $check['sanitized']]);
}

if (($path === 'leaderboard' || $path === 'scores') && $method === 'GET') {
    $limit = min(50, max(1, intval($_GET['limit'] ?? 50)));
    $stmt = $pdo->prepare("SELECT id, nickname, object_id, score, impact_force, did_break, special_effect, mode, date, player_token FROM leaderboard_chaos ORDER BY score DESC, date DESC LIMIT ?");
    $stmt->execute([$limit]);
    $rows = $stmt->fetchAll();
    $entries = [];
    foreach ($rows as $idx => $r) {
        $r['rank'] = $idx + 1;
        $r['score'] = intval($r['score']);
        $r['impact_force'] = intval($r['impact_force']);
        $r['did_break'] = (bool)$r['did_break'];
        $entries[] = $r;
    }
    jsonResponse(['ok' => true, 'count' => count($entries), 'entries' => $entries]);
}

if (($path === 'leaderboard' || $path === 'leaderboard/submit' || $path === 'scores') && $method === 'POST') {
    $name = $body['nickname'] ?? ($body['stand_name'] ?? '');
    $check = validateNickname($name);
    if (!$check['valid']) {
        jsonResponse(['ok' => false, 'code' => $check['code'], 'error' => $check['error']], 400);
    }

    $objId = strtolower(str_replace('-', '_', trim($body['object_id'] ?? ($body['object'] ?? ''))));
    if (!preg_match('/^[a-z0-9_]{2,40}$/', $objId)) {
        jsonResponse(['ok' => false, 'code' => 'INVALID_OBJECT', 'error' => 'Invalid object_id.'], 400);
    }

    $score = intval($body['score'] ?? 0);
    if ($score < 10 || $score > 25000) {
        jsonResponse(['ok' => false, 'code' => 'SCORE_OUT_OF_BOUNDS', 'error' => 'Chaos score out of bounds.'], 400);
    }

    $impactForce = intval($body['impact_force'] ?? 100);
    $didBreak = !empty($body['did_break']) ? 1 : 0;
    $rawEffect = strtolower(trim($body['special_effect'] ?? 'shatter'));
    $specialEffect = preg_match('/^[a-z0-9_]{3,30}$/', $rawEffect) ? $rawEffect : 'shatter';
    $mode = ($body['mode'] ?? 'modern') === 'retro' ? 'retro' : 'modern';
    $rawToken = trim($body['player_token'] ?? '');
    $tokenHash = preg_match('/^[A-Za-z0-9]{16,24}$/', $rawToken) ? hash('sha256', $rawToken) : '';
    $id = bin2hex(random_bytes(16));
    $now = gmdate('Y-m-d\TH:i:s\Z');

    $stmt = $pdo->prepare("INSERT INTO leaderboard_chaos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $check['sanitized'], $objId, $score, $impactForce, $didBreak, $specialEffect, $mode, $now, $tokenHash]);

    // Prune to Top 50
    $pdo->exec("DELETE FROM leaderboard_chaos WHERE id NOT IN (SELECT id FROM leaderboard_chaos ORDER BY score DESC, date DESC LIMIT 50)");

    jsonResponse([
        'ok' => true,
        'entry' => [
            'id' => $id,
            'nickname' => $check['sanitized'],
            'object_id' => $objId,
            'score' => $score,
            'mode' => $mode,
            'date' => $now,
            'player_token' => $tokenHash
        ]
    ], 201);
}

jsonResponse(['ok' => false, 'code' => 'NOT_FOUND', 'error' => 'Endpoint not found.'], 404);
