# BotPanel (UI Shell)

A windowed (non-fullscreen) Electron dashboard: login/license screen →
Dashboard / Bots / Admin. This build is **UI only** — the "Add Bot" modal
saves a name/server/token locally so you can see it in the table, but it does
not open any network connection or join any server. No bot-joining logic is
included.

## Login

- **Account tab:** username `admin`, password `admin123`
- **License tab:** click "Generate" to create a key, it auto-fills, then hit
  "Activate & Enter". Keys are generated and checked locally (cosmetic demo
  license flow, not a real licensing backend).

## Run it (Windows 10, no build needed)

1. Install [Node.js](https://nodejs.org) (LTS) if you don't have it.
2. Unzip this folder anywhere.
3. Open a terminal / PowerShell in the folder and run:
   ```
   npm install
   npm start
   ```
4. The windowed app opens.

## Build a real standalone .exe

This wasn't built in the sandbox that made this zip (no Windows target
available there). To produce an actual `BotPanel Setup.exe` you can double
click without Node installed, run this **on your own Windows machine**, in
the same folder:

```
npm install
npm run build-win
```

`electron-builder` will download what it needs and output an installer to
`dist/`. First run downloads ~150–200MB of Electron/build tooling, so it
needs internet access once.

## Project structure

```
botpanel/
  main.js              Electron main process (window config, IPC)
  package.json          scripts + electron-builder config
  src/
    preload.js          safe bridge for window controls
    login.html/.js       auth + license generation screen
    dashboard.html/.js   sidebar nav + views + Add Bot modal
    style.css            shared styling
```

## Extending it

If/when you want to actually connect to a server, you'd add that logic in
`dashboard.js` (or a separate `bots.js` required from the main process, since
`node-minecraft-protocol` needs Node's `net` module and can't run in the
renderer with `nodeIntegration: false` as currently configured).
