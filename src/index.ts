import { app, protocol } from 'electron';
import { MainBrowser } from './components/BrowserWindow/MainBrowser';
import { TrayIcon } from './components/TrayIcon/TrayIcon';
import { getSettings } from './components/Settings/Settings';
import { getEnvironment } from './utils/environment';

app.setName('SlackDesk');
const envConfig = getEnvironment();
let win: MainBrowser;
let appIcon: Electron.Tray | null = null;
const SettingsController = getSettings();

process.title = envConfig.name;

app.disableHardwareAcceleration();

const slackDesktopUA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Slack/4.52.155 Chrome/128.0.0.0 Electron/31.0.0 Safari/537.36";
app.userAgentFallback = slackDesktopUA;

protocol.registerSchemesAsPrivileged([
    { scheme: 'slackdesk', privileges: { bypassCSP: true, supportFetchAPI: true } }
]);

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (win) {
            win.getFocus();
        }
    });

    app.on("ready", () => {
        win = new MainBrowser(app);
        appIcon = TrayIcon(win, app);
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (SettingsController.getConfig('closeExit')) {
            app.quit();
        }
    }
});

