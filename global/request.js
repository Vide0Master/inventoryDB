async function request(link, type, args) {
    try {
        let usr = JSON.parse(sessionStorage.getItem('account'))
        if (usr == null) usr = { login: 'def', key: 'def' }
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                arguments: args,
                user: { login: usr.login, key: usr.skey }
            }),
        });
        if (!response.ok) {
            return 'nsr'
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Сталась помилка обробки запиту:', error);
    }
}