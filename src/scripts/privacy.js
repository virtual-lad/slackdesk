(function() {
    let styleElement = null;

    const cssContent = `
        /* SlackDesk Dynamic Privacy CSS */
        :root {
            --slackdesk-blur-radius: 5px;
        }

        body.slackdesk-privacy-active.slackdesk-blur-messages [data-qa="message_content"],
        body.slackdesk-privacy-active.slackdesk-blur-messages .c-message_kit__blocks,
        body.slackdesk-privacy-active.slackdesk-blur-messages .c-message__body {
            filter: blur(var(--slackdesk-blur-radius, 5px)) grayscale(0.5) !important;
            transition: filter 0.2s ease !important;
        }
        body.slackdesk-privacy-active.slackdesk-blur-messages [data-qa="message_content"]:hover,
        body.slackdesk-privacy-active.slackdesk-blur-messages .c-message_kit__blocks:hover,
        body.slackdesk-privacy-active.slackdesk-blur-messages .c-message__body:hover {
            filter: blur(0) grayscale(0) !important;
        }

        body.slackdesk-privacy-active.slackdesk-blur-sidebar [data-qa="channel_sidebar_name"],
        body.slackdesk-privacy-active.slackdesk-blur-sidebar .p-channel_sidebar__name,
        body.slackdesk-privacy-active.slackdesk-blur-sidebar .p-channel_sidebar__channel {
            filter: blur(calc(var(--slackdesk-blur-radius, 5px) * 0.8)) !important;
            transition: filter 0.2s ease !important;
        }
        body.slackdesk-privacy-active.slackdesk-blur-sidebar [data-qa="channel_sidebar_name"]:hover,
        body.slackdesk-privacy-active.slackdesk-blur-sidebar .p-channel_sidebar__name:hover,
        body.slackdesk-privacy-active.slackdesk-blur-sidebar .p-channel_sidebar__channel:hover {
            filter: blur(0) !important;
        }

        body.slackdesk-privacy-active.slackdesk-blur-names [data-qa="message_sender_name"],
        body.slackdesk-privacy-active.slackdesk-blur-names .c-message_kit__sender_name,
        body.slackdesk-privacy-active.slackdesk-blur-names .c-message__sender_link,
        body.slackdesk-privacy-active.slackdesk-blur-names [data-qa="channel_name"],
        body.slackdesk-privacy-active.slackdesk-blur-names .p-classic_nav__team_header__name {
            filter: blur(calc(var(--slackdesk-blur-radius, 5px) * 0.8)) !important;
            transition: filter 0.2s ease !important;
        }
        body.slackdesk-privacy-active.slackdesk-blur-names [data-qa="message_sender_name"]:hover,
        body.slackdesk-privacy-active.slackdesk-blur-names .c-message_kit__sender_name:hover,
        body.slackdesk-privacy-active.slackdesk-blur-names .c-message__sender_link:hover,
        body.slackdesk-privacy-active.slackdesk-blur-names [data-qa="channel_name"]:hover,
        body.slackdesk-privacy-active.slackdesk-blur-names .p-classic_nav__team_header__name:hover {
            filter: blur(0) !important;
        }

        body.slackdesk-privacy-active.slackdesk-blur-avatars .c-avatar__image,
        body.slackdesk-privacy-active.slackdesk-blur-avatars [data-qa="user_image"],
        body.slackdesk-privacy-active.slackdesk-blur-avatars .c-avatar {
            filter: blur(calc(var(--slackdesk-blur-radius, 5px) * 1.2)) grayscale(0.8) !important;
            transition: filter 0.2s ease !important;
        }
        body.slackdesk-privacy-active.slackdesk-blur-avatars .c-avatar__image:hover,
        body.slackdesk-privacy-active.slackdesk-blur-avatars [data-qa="user_image"]:hover,
        body.slackdesk-privacy-active.slackdesk-blur-avatars .c-avatar:hover {
            filter: blur(0) grayscale(0) !important;
        }

        body.slackdesk-privacy-active.slackdesk-blur-media .c-file_container,
        body.slackdesk-privacy-active.slackdesk-blur-media .c-message_attachment,
        body.slackdesk-privacy-active.slackdesk-blur-media img.c-message__image,
        body.slackdesk-privacy-active.slackdesk-blur-media .c-message_kit__file {
            filter: blur(calc(var(--slackdesk-blur-radius, 5px) * 1.5)) grayscale(0.8) !important;
            transition: filter 0.2s ease !important;
        }
        body.slackdesk-privacy-active.slackdesk-blur-media .c-file_container:hover,
        body.slackdesk-privacy-active.slackdesk-blur-media .c-message_attachment:hover,
        body.slackdesk-privacy-active.slackdesk-blur-media img.c-message__image:hover,
        body.slackdesk-privacy-active.slackdesk-blur-media .c-message_kit__file:hover {
            filter: blur(0) grayscale(0) !important;
        }
    `;

    function initStyle() {
        if (!document.getElementById('slackdesk-privacy-style')) {
            styleElement = document.createElement('style');
            styleElement.id = 'slackdesk-privacy-style';
            styleElement.textContent = cssContent;
            (document.head || document.documentElement).appendChild(styleElement);
        }
    }

    window.updatePrivacySettings = function(settings) {
        initStyle();
        const body = document.body;
        if (!body) return;

        if (settings.blurRadius) {
            document.documentElement.style.setProperty('--slackdesk-blur-radius', settings.blurRadius + 'px');
        }

        if (settings.enabled) {
            body.classList.add('slackdesk-privacy-active');
        } else {
            body.classList.remove('slackdesk-privacy-active');
        }

        const classMap = {
            blurMessages: 'slackdesk-blur-messages',
            blurSidebar: 'slackdesk-blur-sidebar',
            blurNames: 'slackdesk-blur-names',
            blurAvatars: 'slackdesk-blur-avatars',
            blurMedia: 'slackdesk-blur-media'
        };

        for (let key in classMap) {
            if (settings[key] !== false) {
                body.classList.add(classMap[key]);
            } else {
                body.classList.remove(classMap[key]);
            }
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initStyle();
    } else {
        document.addEventListener('DOMContentLoaded', initStyle);
    }
})();
