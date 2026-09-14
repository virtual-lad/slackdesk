import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { AppSettingsSchema, ValueSettings } from './SettingInterface';

class SettingsController extends EventEmitter {
    private configPath: string;
    private configs: AppSettingsSchema;

    constructor() {
        super();
        const userDataPath = app ? app.getPath('userData') : path.join(process.env.HOME || '.', '.config', 'slackdesk');
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
        this.configPath = path.join(userDataPath, 'settings.json');

        this.configs = {
            privacyBlur: {
                name: "privacyBlur",
                description: "Global Blur Privacy Mode",
                type: "boolean",
                value: true,
                default: true
            },
            blurRadius: {
                name: "blurRadius",
                description: "Blur Radius Intensity (px)",
                type: "number",
                value: 5,
                default: 5
            },
            blurMessages: {
                name: "blurMessages",
                description: "Blur Chat Messages",
                type: "boolean",
                value: true,
                default: true
            },
            blurSidebar: {
                name: "blurSidebar",
                description: "Blur Sidebar Channels & DMs",
                type: "boolean",
                value: true,
                default: true
            },
            blurNames: {
                name: "blurNames",
                description: "Blur Sender & User Names",
                type: "boolean",
                value: true,
                default: true
            },
            blurAvatars: {
                name: "blurAvatars",
                description: "Blur Profile Avatars",
                type: "boolean",
                value: true,
                default: true
            },
            blurMedia: {
                name: "blurMedia",
                description: "Blur Images & File Attachments",
                type: "boolean",
                value: true,
                default: true
            },
            customUrl: {
                name: "customUrl",
                description: "Custom Startup Slack URL",
                type: "string",
                value: "",
                default: ""
            },
            closeExit: {
                name: "closeExit",
                description: "Exit Application on Window Close",
                type: "boolean",
                value: false,
                default: false
            },
            skipTaskbar: {
                name: "skipTaskbar",
                description: "Hide App from Taskbar",
                type: "boolean",
                value: false,
                default: false
            },
            multiInstance: {
                name: "multiInstance",
                description: "Allow Multiple Instances",
                type: "boolean",
                value: false,
                default: false
            }
        };

        this.loadSettings();
    }

    private loadSettings(): void {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                for (const key in data) {
                    if (this.configs[key]) {
                        this.configs[key].value = data[key];
                    }
                }
            }
        } catch (e) {
            console.error("Failed to load settings:", e);
        }
    }

    private saveSettings(): void {
        try {
            const dataToSave: Record<string, any> = {};
            for (const key in this.configs) {
                dataToSave[key] = this.configs[key].value;
            }
            fs.writeFileSync(this.configPath, JSON.stringify(dataToSave, null, 2), 'utf8');
        } catch (e) {
            console.error("Failed to save settings:", e);
        }
    }

    public getConfig(name: string): any {
        return this.configs[name] ? this.configs[name].value : null;
    }

    public getAllConfigs(): AppSettingsSchema {
        return this.configs;
    }

    public saveConfig(name: string, value: any): void {
        if (this.configs[name]) {
            this.configs[name].value = value;
            this.saveSettings();
            this.emit('updateSettings', name, this.configs[name]);
        }
    }
}

let instance: SettingsController | null = null;
export function getSettings(): SettingsController {
    if (!instance) {
        instance = new SettingsController();
    }
    return instance;
}
