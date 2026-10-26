# Drop The Thing — Leaderboard REST API Documentation

**Production Base URL:** `https://dropthething.stabthefinger.com/api` (also supports `/drop/api`)  
**Local Development URL:** `http://localhost:3000/api` (or `http://localhost:3000/drop/api`)

All endpoints enforce:
- Shared family-friendly nickname validation (`ProfanityFilter.validateNickname`, identical to Lemonade Stand rules: `3–18` chars, `^[A-Za-z0-9_]{3,18}$`, token + substring + leetspeak + phonetic filtering)
- Parameterized SQLite queries (`node:sqlite` in Node.js / `PDO` in PHP)
- Automatic pruning to the **Top 50 Chaos Scores**
- Anonymous player token hashing (`sha256(player_token)`)

---

## 1. Healthcheck

- **Endpoint:** `GET /api/health` (or `GET /drop/api/health`)
- **Success Response (`200 OK`):**
```json
{
  "ok": true,
  "service": "drop-the-thing-api",
  "deployTarget": "dropthething.stabthefinger.com",
  "version": "1.0.0",
  "timestamp": "2026-10-23T21:30:00.000Z"
}
```

---

## 2. Validate Nickname

Validates a candidate player nickname against length (`3–18`), character whitelist (`^[A-Za-z0-9_]{3,18}$`), and token/substring profanity rules.

- **Endpoint:** `POST /api/validate-nickname`
- **Request Body:**
```json
{
  "nickname": "GravityChamp"
}
```
- **Success Response (`200 OK`):**
```json
{
  "ok": true,
  "valid": true,
  "nickname": "GravityChamp",
  "normalized": "gravitychamp",
  "message": ""
}
```

---

## 3. Fetch Top 50 Chaos Leaderboard

Returns the Top 50 Chaos Scores ordered by `score DESC, date DESC`.

- **Endpoint:** `GET /api/leaderboard` (alias: `GET /api/scores`)
- **Query Parameters (Optional):**
  - `limit`: `1–50` (default `50`)
  - `object`: Filter by one of the 12 objects (e.g. `piano`, `watermelon`, `anvil`)
  - `mode`: Filter by visual mode (`modern` or `retro`)
- **Success Response (`200 OK`):**
```json
{
  "ok": true,
  "title": "Top 50 Chaos Leaderboard",
  "count": 12,
  "entries": [
    {
      "rank": 1,
      "id": "e4d909c2-90d0-4b5a-9c8e-123456789abc",
      "nickname": "GravityChamp",
      "object_id": "piano",
      "score": 842,
      "impact_force": 185,
      "did_break": true,
      "special_effect": "shatter",
      "mode": "modern",
      "date": "2026-10-23T21:30:00.000Z",
      "player_token": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
    }
  ]
}
```

---

## 4. Submit Chaos Score

Records a verified Chaos Score on the Top 50 Leaderboard and prunes entries beyond rank 50.

- **Endpoint:** `POST /api/leaderboard` (aliases: `POST /api/scores`, `POST /api/leaderboard/submit`)
- **Request Body:**
```json
{
  "nickname": "GravityChamp",
  "object_id": "piano",
  "score": 842,
  "impact_force": 185,
  "did_break": true,
  "special_effect": "shatter",
  "mode": "modern",
  "player_token": "AbCdEfGhIjKlMnOpQrSt"
}
```
- **Success Response (`201 Created`):**
```json
{
  "ok": true,
  "message": "Chaos score recorded in the Top 50 Leaderboard!",
  "entry": {
    "id": "e4d909c2-90d0-4b5a-9c8e-123456789abc",
    "nickname": "GravityChamp",
    "object_id": "piano",
    "score": 842,
    "impact_force": 185,
    "did_break": true,
    "special_effect": "shatter",
    "mode": "modern",
    "date": "2026-10-23T21:30:00.000Z",
    "player_token": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
  }
}
```
