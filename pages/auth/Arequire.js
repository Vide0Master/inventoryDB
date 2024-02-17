const base_requirements = [
    { type: 'script', link: 'parts/alert/alert.js' },
    { type: 'script', link: 'auth_session_controller.js' },
    { type: 'style', link: 'nullify.css' },
    { type: 'style', link: 'style.css' },
    { type: 'script', link: 'script.js' },
];

function loadScriptAsync(reqr) {
    return new Promise((resolve, reject) => {
        const head = document.getElementsByTagName('head')[0];
        switch (reqr.type) {
            case 'script': {
                const script = document.createElement('script');
                script.src = reqr.link;
                script.defer = true;
                script.onload = resolve;
                script.onerror = reject;
                head.appendChild(script);
            }; break;
            case 'style': {
                const style = document.createElement('link');
                style.href = reqr.link;
                style.rel = "stylesheet";
                head.appendChild(style);
                resolve();
            }; break;
        }
    });
}

function head_require(requirements) {
    // Using reduce to chain promises sequentially
    return requirements.reduce((promise, reqr) => {
        return promise.then(() => loadScriptAsync(reqr));
    }, Promise.resolve());
}

head_require(base_requirements)
    .then(() => {
        console.log('All scripts and styles are loaded.');
    })
    .catch((error) => {
        console.error('Error loading scripts or styles:', error);
    });
