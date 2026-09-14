(function() {
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }
        if (target && target.tagName === 'A' && target.href) {
            const href = target.href;
            if (href.startsWith('http://') || href.startsWith('https://')) {
                if (!href.includes('app.slack.com') && !href.includes('slack.com/client')) {
                    // Let main process windowOpenHandler take care of external links
                }
            }
        }
    }, true);
})();
