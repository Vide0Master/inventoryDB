keychain()

async function keychain(){
    try {
        const account = JSON.parse(sessionStorage.getItem('account'))
        const response = await fetch('/api/check_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'check_key',
                arguments: { login: account.login, key: account.skey, LP:window.location.pathname },
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.result !== 'success') {
            sessionStorage.clear()
            window.location.href = '/';
        }
    } catch {
        window.location.href = '/'
    }
}