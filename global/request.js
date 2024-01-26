async function request(link, type, args) {
    try {
        const usr = JSON.parse(sessionStorage.getItem('account'))
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
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Сталась помилка обробки запиту:', error);
    }
}