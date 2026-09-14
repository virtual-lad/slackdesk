# SlackDesk 🔒

> **SlackDesk** is a custom desktop client for Slack Web built on Electron with an integrated, dynamic **Blur Privacy Mode**. 

SlackDesk protects your sensitive conversations in open offices, public workspaces, and screen-sharing sessions by automatically blurring chat messages, channel sidebars, sender names, user avatars, and media attachments until you hover over them.

---

## ✨ Features

- 🛡️ **Blur Privacy Mode**: Automatically applies high-quality CSS blur filters to Slack content.
- 👁️ **Hover to Reveal**: Hover your cursor over any message, channel name, avatar, or image to temporarily unblur it.
- ⚡ **Hotkey Controls**:
  - `Ctrl+P` / `Cmd+P`: Instantly toggle Privacy Blur mode on or off.
  - `Ctrl+S` / `Cmd+S`: Open the SlackDesk Settings dialog.
  - `Ctrl+R` / `Cmd+R`: Reload current workspace view.
  - `Ctrl+Shift+I`: Open Chrome Developer Tools.
- ⚙️ **Granular Blur Settings**: Configure which elements to blur:
  - Chat Messages & Blocks
  - Channel & DM Sidebar List
  - Sender & User Display Names
  - Profile Avatars & User Badges
  - Attached Images, Videos & Files
- 🔄 **Persistent Sync & Sessions**: Uses persistent partition storage (`persist:slackdesk`). You remain logged in across restarts with full workspace synchronization.
- 📌 **System Tray Integration**: Minimizes to system tray with quick action context menu options.
- 🚀 **Linux Desktop Integration**: Ships with a `.desktop` application shortcut and high-resolution logo icon for Linux app launchers.

---

## 🛠️ Architecture & Technical Fixes

### Preload Environment Stub (`preload_stub.js`)
Slack Web inspects `window.getDesktopState("environment")` via desktop Redux states when loaded inside a desktop client UA (`Slack/4.52.155`). To prevent unhandled React unmount crashes, SlackDesk injects a desktop state tree providing mock environment parameters (`platform: linux`, `arch: x64`, `releaseChannel: prod`, and state getters) directly into the renderer context.

### Navigation Header & User-Agent Hijacking
Intercepts outbound HTTP request headers for Slack domains (`*.slack.com`, `*.slack-edge.com`) to enforce the Slack Desktop client identity string, bypassing web browser deprecation screens.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation & Run

1. Clone or navigate to the project root:
   ```bash
   cd /home/dell/Applications/slackdesk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch SlackDesk:
   ```bash
   npm start
   ```

---

## 📦 Building Standalone Installers

SlackDesk is configured with `electron-builder` to produce standalone installation packages for Linux and Windows:

```bash
npm run build
```

The output installers will be compiled inside the `dist/` directory:

- 🐧 **Linux Debian Package**: `dist/slackdesk_1.0.0_amd64.deb`
- 🐧 **Linux AppImage**: `dist/SlackDesk-1.0.0.AppImage`
- 🪟 **Windows Executable**: `dist/SlackDesk Setup 1.0.0.exe` *(cross-compiles on Linux with Wine or builds on Windows)*

### Installing the `.deb` Package on Ubuntu/Debian
```bash
sudo dpkg -i dist/slackdesk_1.0.0_amd64.deb
```

---

## 💻 Linux Application Launcher

SlackDesk includes a desktop entry for Linux desktop environments (GNOME, KDE, XFCE):

```bash
~/.local/share/applications/slackdesk.desktop
```
Simply search for **SlackDesk** in your system app launcher!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed by **Junaid Tariq** ([junaidtariqhere@gmail.com](mailto:junaidtariqhere@gmail.com)).
