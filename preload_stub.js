// Preload script for SlackDesk
(function() {
    console.log('[SLACKDESK PRELOAD] Injecting exact desktop state tree...');

    const fullDesktopStateTree = {
        environment: {
            appVersion: "4.52.155",
            releaseChannel: "prod",
            platform: "linux",
            arch: "x64",
            uuid: "slackdesk-uuid-1001",
            sessionId: "slackdesk-session-1001",
            isGpuCompositionAvailable: false,
            darwin: false,
            linux: {
                distro: "Ubuntu",
                version: "22.04",
                isStore: false
            },
            win32: false,
            platformVersion: { major: 6, minor: 8, build: 0 },
            isMac: false,
            isLinux: true,
            isWindows: false
        },
        settings: {
            releaseChannelOverride: null,
            zoomLevel: 0,
            useHwAcceleration: false,
            spellcheck: true
        },
        app: {
            hwAccelAvailability: "disabled"
        },
        darwin: false,
        linux: true,
        win32: false,
        isMac: false,
        isLinux: true,
        isWindows: false,
        isDesktop: true,
        isElectron: true,
        appVersion: "4.52.155"
    };

    const getStateFn = function(...pathKeys) {
        if (pathKeys.length === 0) return fullDesktopStateTree;
        let curr = fullDesktopStateTree;
        for (let i = 0; i < pathKeys.length; i++) {
            const k = pathKeys[i];
            if (curr === null || curr === undefined || typeof curr !== 'object') {
                return undefined;
            }
            curr = curr[k];
        }
        return curr;
    };
    getStateFn.isAvailable = () => true;

    const reduxObj = {
        getState: getStateFn,
        dispatchUpdate: () => {},
        subscribe: () => () => {}
    };

    const windowObj = {
        isFocused: () => true,
        flashFrame: () => {},
        setOverlayIcon: () => {},
        getWindowId: () => 1,
        getDesktopState: getStateFn,
        on: () => {},
        off: () => {},
        addListener: () => {},
        removeListener: () => {}
    };

    const appObj = {
        setZoom: () => {},
        didFinishLoading: () => {},
        getAppPath: () => "",
        getLocaleInformation: () => ({ locale: "en-US" }),
        on: () => {},
        off: () => {},
        addListener: () => {},
        removeListener: () => {}
    };

    const accessibilityObj = {
        isAccessibilitySupportEnabled: () => false,
        globalShortcut: {
            isRegistered: () => false,
            toggleShortcutHandler: () => {},
            registerShortcutHandler: () => {}
        }
    };

    // Construct window.desktop
    window.desktop = {
        redux: reduxObj,
        window: windowObj,
        app: appObj,
        accessibility: accessibilityObj,
        on: () => {},
        off: () => {},
        send: () => {},
        invoke: () => Promise.resolve({}),
        getDesktopState: getStateFn
    };

    window.slackDesktop = window.desktop;
    window.getDesktopState = getStateFn;

    window.TS = window.TS || {};
    window.TS.boot_data = window.TS.boot_data || {};
    window.TS.boot_data.desktop_state = fullDesktopStateTree;

    console.log('[SLACKDESK PRELOAD] Desktop state tree injected successfully.');
})();
