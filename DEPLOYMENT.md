# Deployment Guide — `dropthething.stabthefinger.com`

This guide covers deploying **Drop The Thing** to **`https://dropthething.stabthefinger.com`** (or `stabthefinger.com/drop`) using either:
1. **Option A: cPanel / JetHost / Apache Shared Hosting** (subdomain root or `public_html/drop` with zero-dependency PHP + SQLite API)
2. **Option B: Node.js + Built-in SQLite Server** (Fly.io, Render, or VPS reverse-proxied)
3. **Option C: Static Frontend (Vercel / Netlify) + API Backend**

---

## Option A: Deploy to `dropthething.stabthefinger.com` on JetHost / cPanel (Recommended)

Because `frontend/` includes a complete native PHP + PDO SQLite API (`frontend/api/index.php`) and Apache routing (`frontend/.htaccess`), you can deploy directly into the document root of `dropthething.stabthefinger.com` (or the `/drop` folder of `stabthefinger.com`) with zero Node.js setup required on the server.

### 1. Build Assets Locally
```bash
npm run build
```
This generates all 12 Modern SVGs, 12 Retro Pixel-Art SVGs, and 7 WAV sound effects inside `frontend/assets/`.

### 2. Upload to Server
1. Log into your **cPanel / JetHost** panel for `stabthefinger.com`.
2. Open **File Manager** and navigate to your subdomain root (e.g. `public_html/dropthething` or `public_html/drop`).
3. Upload the entire contents of `frontend/` into that folder:
   - `index.html`
   - `.htaccess`
   - `css/styles.css`
   - `js/profanityFilter.js`
   - `js/objects.js`
   - `js/sound.js`
   - `js/physics.js`
   - `js/app.js`
   - `assets/`
   - `api/index.php`
4. Visit **`https://dropthething.stabthefinger.com`** (or `https://stabthefinger.com/drop`).
   - On first request, `api/index.php` automatically creates `data/dropthething.db` (protected by a `Deny from all` `.htaccess`), applies the schema, and seeds the Top 50 Chaos Leaderboard.
   - Share links like `https://dropthething.stabthefinger.com/?object=piano&score=842` work automatically!

---

## Option B: Unified Node.js + Built-in SQLite Deployment (Fly.io / Render / VPS)

`backend/server.js` uses Node.js 22+ built-in `node:http` and `node:sqlite` (zero external npm packages required) and natively serves both `/` and `/drop` routes.

### 1. Run Locally or on a VPS
```bash
npm run build
npm start
```
The server starts on `http://localhost:3000` (and `http://localhost:3000/drop`).

### 2. Nginx Reverse Proxy for `dropthething.stabthefinger.com`
If using Nginx in front of Node.js:
```nginx
server {
    server_name dropthething.stabthefinger.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
}
```

### 3. Deploy with Fly.io
```bash
fly launch --no-deploy --name drop-the-thing-api
fly volumes create drop_sqlite_data --region ord --size 1
fly deploy
```
