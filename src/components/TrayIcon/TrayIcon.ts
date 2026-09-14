import { Tray, Menu, App } from 'electron';
import path from 'path';
import fs from 'fs';
import { MainBrowser } from '../BrowserWindow/MainBrowser';

export function TrayIcon(mainBrowser: MainBrowser, app: App): Tray | null {
    let iconPath = path.resolve(__dirname, "..", "..", "icon", "logo.png");
    if (!fs.existsSync(iconPath)) {
        iconPath = path.resolve(__dirname, "..", "..", "..", "src", "icon", "logo.png");
    }

    let tray: Tray | null = null;
    try {
        if (fs.existsSync(iconPath)) {
            tray = new Tray(iconPath);
        } else {
            // Fallback tray without explicit file icon
            return null;
        }
    } catch (err) {
        console.log("Tray icon not initialized:", err);
        return null;
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide SlackDesk',
            click: () => {
                mainBrowser.toogleVisibility();
            }
        },
        {
            label: 'Toggle Privacy Mode',
            click: () => {
                mainBrowser.togglePrivacy();
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('SlackDesk with Blur Privacy');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        mainBrowser.toogleVisibility();
    });

    return tray;
}
