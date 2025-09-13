# CHAT-APP

Realtime chat application with a React + Vite frontend and a Node.js + Express + Socket.IO backend.  
Features include direct messaging, image sharing, online presence, and profile editing.

---

## Features

- Realtime messaging with Socket.IO
- Image sharing (base64 → optional Cloudinary)
- Online presence / status indicator
- Profile page with avatar, name and bio editing
- Responsive 3‑pane layout: Sidebar — Chat — Right details pane

## Tech Stack

- Frontend: React, Vite, Tailwind utility classes (or plain CSS), react-router
- Backend: Node.js, Express, Socket.IO, Mongoose (MongoDB)
- Optional: Cloudinary for image hosting

## Repository layout

- `/client` — React + Vite app (UI)
- `/server` — Express server, Socket.IO, REST API
- `.gitignore` — ignores node_modules, .env, build artifacts

---

## Quick start (local)

Prerequisites:

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- (Optional) Cloudinary account

1. Clone repository

```bash
git clone https://github.com/Protrick/CHAT-APP.git
cd CHAT-APP
```

2. Server

```bash
cd server
npm install
# create .env from example and fill values
cp .env.example .env
# start dev server (adjust to package.json scripts if necessary)
npm run dev
```

3. Client

```bash
cd ../client
npm install
# create .env from example and set VITE_BACKEND_URL
cp .env.example .env
npm run dev
# open http://localhost:5173
```

Run client and server in separate terminals.

---

## Environment examples

Create `server/.env` (do NOT commit real secrets):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Consider adding `client/.env.example` and `server/.env.example` with placeholders for collaborators.

---

## Build & deploy

Client:

```bash
cd client
npm run build
# deploy the generated dist folder to a static host (Netlify, Vercel, etc.)
```

Server:

- Deploy to any Node host (Render, Heroku, DigitalOcean) and set environment variables via the provider dashboard.
- Ensure CORS origins in `server/server.js` include your deployed frontend origin.

---

## Removing sensitive data from git history (warning)

If a secret file was committed, remove it from history (this rewrites history and requires force-push). Recommended tools:

- `git-filter-repo` (preferred)
- BFG Repo-Cleaner

Always back up the repository before rewriting history and inform collaborators.

---

## Troubleshooting

- Socket connection issues: verify backend URL and CORS configuration.
- Large image uploads: server accepts large payloads (see `server/server.js` body-parser limits).
- If layout issues occur, check `client/src/pages/HomePage.jsx` and component padding.

---

## Contributing

1. Fork → branch → commit → PR
2. Do not commit `.env` or other secrets; include `.env.example` instead
3. Run linters/tests before submitting PR

---

## License

MIT

---

````<!-- filepath: c:\Users\KIIT0001\Desktop\CHAT-APP\README.md -->
# CHAT-APP

Realtime chat application with a React + Vite frontend and a Node.js + Express + Socket.IO backend.
Features include direct messaging, image sharing, online presence, and profile editing.

---

## Features
- Realtime messaging with Socket.IO
- Image sharing (base64 → optional Cloudinary)
- Online presence / status indicator
- Profile page with avatar, name and bio editing
- Responsive 3‑pane layout: Sidebar — Chat — Right details pane

## Tech Stack
- Frontend: React, Vite, Tailwind utility classes (or plain CSS), react-router
- Backend: Node.js, Express, Socket.IO, Mongoose (MongoDB)
- Optional: Cloudinary for image hosting

## Repository layout
- `/client` — React + Vite app (UI)
- `/server` — Express server, Socket.IO, REST API
- `.gitignore` — ignores node_modules, .env, build artifacts

---

## Quick start (local)

Prerequisites:
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- (Optional) Cloudinary account

1. Clone repository
```bash
git clone https://github.com/Protrick/CHAT-APP.git
cd CHAT-APP
````

2. Server

```bash
cd server
npm install
# create .env from example and fill values
cp .env.example .env
# start dev server (adjust to package.json scripts if necessary)
npm run dev
```

3. Client

```bash
cd ../client
npm install
# create .env from example and set VITE_BACKEND_URL
cp .env.example .env
npm run dev
# open http://localhost:5173
```

Run client and server in separate terminals.

---

## Environment examples

Create `server/.env` (do NOT commit real secrets):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Consider adding `client/.env.example` and `server/.env.example` with placeholders for collaborators.

---

## Build & deploy

Client:

```bash
cd client
npm run build
# deploy the generated dist folder to a static host (Netlify, Vercel, etc.)
```

Server:

- Deploy to any Node host (Render, Heroku, DigitalOcean) and set environment variables via the provider dashboard.
- Ensure CORS origins in `server/server.js` include your deployed frontend origin.

---

## Removing sensitive data from git history (warning)

If a secret file was committed, remove it from history (this rewrites history and requires force-push). Recommended tools:

- `git-filter-repo` (preferred)
- BFG Repo-Cleaner

Always back up the repository before rewriting history and inform collaborators.

---

## Troubleshooting

- Socket connection issues: verify backend URL and CORS configuration.
- Large image uploads: server accepts large payloads (see `server/server.js` body-parser limits).
- If layout issues occur, check `client/src/pages/HomePage.jsx` and component padding.

---

## Contributing

1. Fork → branch → commit → PR
2. Do not commit `.env` or other secrets; include `.env.example` instead
3. Run linters/tests before submitting PR

---

## License

MIT

---
