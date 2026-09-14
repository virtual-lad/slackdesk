import { BrowserWindow, Menu, shell, App } from "electron";
import path from 'path';
import fs from 'fs';
import { EventEmitter } from 'events';
import { getSettings } from "../Settings/Settings";
import { SettingWindow } from "../../windows/SettingsWindow/SettingsWindow";

const SettingController = getSettings();

export class MainBrowser extends EventEmitter {
    private win: Electron.BrowserWindow | undefined;
    private app: App;

    constructor(app: App) {
        super();
        this.app = app;
        this.init();
    }

    init(): void {
        const preloadPath = path.resolve(__dirname, '../../../preload_stub.js');
        this.win = new BrowserWindow({
            width: 1200,
            height: 800,
            show: true,
            title: "SlackDesk",
            webPreferences: {
                plugins: true,
                spellcheck: true,
                sandbox: false,
                contextIsolation: false,
                nodeIntegration: false,
                preload: preloadPath,
                partition: "persist:slackdesk",
                devTools: true,
                backgroundThrottling: false,
            }
        });

        if (!this.win) {
            throw new Error("Browser window could not be created");
        }

        const settings = SettingController.getAllConfigs();
        if (settings.skipTaskbar.value) {
            this.win.setSkipTaskbar(true);
        }

        this.eventsInit();
        this.loadUrl();
        this.createMenu();
    }

    public getBrowser(): Electron.BrowserWindow | undefined {
        return this.win;
    }

    public loadUrl(): boolean {
        if (!this.win) return false;

        let customUrl = (SettingController.getConfig('customUrl') || "").trim();
        let targetUrl = "https://app.slack.com/";

        if (customUrl.length > 0) {
            if (!customUrl.startsWith("http://") && !customUrl.startsWith("https://")) {
                if (!customUrl.includes(".")) {
                    customUrl = `https://${customUrl}.slack.com`;
                } else {
                    customUrl = `https://${customUrl}`;
                }
            }
            targetUrl = customUrl;
        }

        const slackDesktopUA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Slack/4.52.155 Chrome/128.0.0.0 Electron/31.0.0 Safari/537.36";

        this.win.webContents.setUserAgent(slackDesktopUA);

        this.win.webContents.session.webRequest.onBeforeSendHeaders({ urls: ['*://*.slack.com/*', '*://*.slack-edge.com/*', '*://*.slack-imgs.com/*'] }, (details, callback) => {
            details.requestHeaders['User-Agent'] = slackDesktopUA;
            callback({ requestHeaders: details.requestHeaders });
        });

        this.win.loadURL(targetUrl);
        return true;
    }

    public reload(): boolean {
        return this.loadUrl();
    }

    public togglePrivacy(): void {
        if (!this.win) return;
        const currentValue = SettingController.getConfig('privacyBlur');
        const newValue = !currentValue;
        SettingController.saveConfig('privacyBlur', newValue);
        this.syncPrivacyToWebContents();
    }

    public syncPrivacyToWebContents(): void {
        if (!this.win) return;
        const configs = SettingController.getAllConfigs();
        const settingsPayload = {
            enabled: configs.privacyBlur.value,
            blurMessages: configs.blurMessages.value,
            blurSidebar: configs.blurSidebar.value,
            blurNames: configs.blurNames.value,
            blurAvatars: configs.blurAvatars.value,
            blurMedia: configs.blurMedia.value
        };
        this.win.webContents.executeJavaScript(`
            if (window.updatePrivacySettings) {
                window.updatePrivacySettings(${JSON.stringify(settingsPayload)});
            }
        `);
    }

    public getFocus(): void {
        if (!this.win) return;
        if (!this.win.isVisible()) this.win.show();
        if (this.win.isMinimized()) this.win.restore();
        this.win.focus();
    }

    public createMenu(): void {
        if (!this.win) return;
        const menu = Menu.buildFromTemplate([
            {
                label: '&Tools',
                submenu: [
                    {
                        label: 'Toggle Privacy Mode',
                        accelerator: "CommandOrControl+P",
                        click: () => {
                            this.togglePrivacy();
                        }
                    },
                    {
                        label: 'Settings',
                        accelerator: "CommandOrControl+S",
                        click: () => {
                            SettingWindow();
                        }
                    },
                    {
                        label: 'Reload',
                        accelerator: "CommandOrControl+R",
                        click: () => {
                            this.reload();
                        }
                    }
                ]
            },
            {
                label: '&View',
                submenu: [
                    {
                        label: 'Toggle Developer Tools',
                        accelerator: "CommandOrControl+Shift+I",
                        click: () => {
                            if (this.win && this.win.webContents.isDevToolsOpened()) {
                                this.win.webContents.closeDevTools();
                            } else if (this.win) {
                                this.win.webContents.openDevTools();
                            }
                        }
                    },
                    {
                        label: 'Show/Hide Menu Bar',
                        accelerator: "CommandOrControl+H",
                        click: () => {
                            if (this.win) {
                                this.win.setMenuBarVisibility(!this.win.isMenuBarVisible());
                                this.win.setAutoHideMenuBar(!this.win.isMenuBarVisible());
                            }
                        }
                    }
                ]
            }
        ]);
        this.win.setMenu(menu);
    }

    public toogleVisibility(): void {
        if (!this.win) return;
        this.win.isVisible() ? this.win.hide() : this.win.show();
    }

    private eventsInit(): void {
        if (!this.win) return;

        this.win.on('page-title-updated', (evt: any, title: string) => {
            evt.preventDefault();
            this.win?.setTitle(title.includes("Slack") ? title : `${title} - SlackDesk`);
        });

        this.win.on('close', (event: any) => {
            const closeExit = SettingController.getConfig('closeExit');
            if (closeExit) {
                this.app.quit();
            } else {
                event.preventDefault();
                this.win?.hide();
            }
        });

        this.win.webContents.on('did-finish-load', async () => {
            await this.scriptLoad();
            this.syncPrivacyToWebContents();
        });

        this.win.webContents.setWindowOpenHandler(({ url }) => {
            const allowedAuthDomains = [
                'slack.com',
                'slack-edge.com',
                'accounts.google.com',
                'appleid.apple.com',
                'login.microsoftonline.com',
                'okta.com',
                'onelogin.com',
                'auth0.com'
            ];
            const isAllowed = allowedAuthDomains.some(domain => url.includes(domain));
            if (!isAllowed) {
                shell.openExternal(url);
                return { action: 'deny' };
            }
            return { action: 'allow' };
        });

        SettingController.on('updateSettings', (name: string, value: any) => {
            if (name.startsWith('blur') || name === 'privacyBlur') {
                this.syncPrivacyToWebContents();
            } else if (name === 'skipTaskbar') {
                this.win?.setSkipTaskbar(value.value);
            }
        });
    }

    private async scriptLoad(): Promise<void> {
        if (!this.win) return;

        let scriptsDir = path.resolve(__dirname, "..", "scripts");
        if (!fs.existsSync(scriptsDir)) {
            scriptsDir = path.resolve(__dirname, "..", "..", "scripts");
        }
        if (!fs.existsSync(scriptsDir)) {
            scriptsDir = path.resolve(__dirname, "..", "..", "src", "scripts");
        }
        if (!fs.existsSync(scriptsDir)) return;

        const injectScripts = fs.readdirSync(scriptsDir);
        for (const scriptName of injectScripts) {
            if (scriptName.endsWith('.js')) {
                const scriptPath = path.join(scriptsDir, scriptName);
                const script = fs.readFileSync(scriptPath, "utf8");
                try {
                    await this.win.webContents.executeJavaScript(`${script};`);
                } catch (ex) {
                    console.error(`Error injecting ${scriptName}:`, ex);
                }
            }
        }
    }
}
