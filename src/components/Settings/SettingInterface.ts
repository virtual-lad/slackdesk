export interface SettingConfigInterface {
    name: string;
    description: string;
    type: "boolean" | "string" | "number";
    value: any;
    default: any;
}

export type ValueSettings = SettingConfigInterface;

export interface AppSettingsSchema {
    privacyBlur: SettingConfigInterface;
    blurMessages: SettingConfigInterface;
    blurSidebar: SettingConfigInterface;
    blurNames: SettingConfigInterface;
    blurAvatars: SettingConfigInterface;
    blurMedia: SettingConfigInterface;
    customUrl: SettingConfigInterface;
    closeExit: SettingConfigInterface;
    skipTaskbar: SettingConfigInterface;
    multiInstance: SettingConfigInterface;
}
