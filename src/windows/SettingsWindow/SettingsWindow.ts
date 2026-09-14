import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { getSettings } from '../../components/Settings/Settings';

let settingsWin: BrowserWindow | null = null;
const settingsController = getSettings();

export function SettingWindow(): BrowserWindow {
    if (settingsWin) {
        settingsWin.focus();
        return settingsWin;
    }

    settingsWin = new BrowserWindow({
        width: 540,
        height: 720,
        resizable: false,
        title: "SlackDesk Settings",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const htmlPath = path.resolve(__dirname, 'settings.html');
    settingsWin.loadFile(htmlPath);

    settingsWin.on('closed', () => {
        settingsWin = null;
    });

    return settingsWin;
}

ipcMain.on('get-settings', (event) => {
    event.returnValue = settingsController.getAllConfigs();
});

ipcMain.on('save-setting', (event, { name, value }) => {
    settingsController.saveConfig(name, value);
});
