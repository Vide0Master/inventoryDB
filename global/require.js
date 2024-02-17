const base_requirements = [
    { type: 'script', link: 'parts/page_structure.js' },
    { type: 'script', link: 'session_controller.js' },
    { type: 'style', link: 'nullify.css' }
];

function loadScriptAsync(reqr) {
    console.log(reqr)
    return new Promise((resolve, reject) => {
        const head = document.getElementsByTagName('head')[0];
        switch (reqr.type) {
            case 'script': {
                const script = document.createElement('script');
                script.src = reqr.link;
                script.defer = true;
                script.onload = resolve();
                script.onerror = reject();
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
    return new Promise(resolve=>{
        const promises = requirements.map(reqr=>{
            return new Promise((resolve)=>{
                loadScriptAsync(reqr).then(resolve())
            })
        })
        Promise.all(promises).then(resolve())
    })
}
head_require(base_requirements)
            .then(() => {
                console.log('All scripts and styles are loaded.');
            })
            .catch((error) => {
                console.error('Error loading scripts or styles:', error);
            });
