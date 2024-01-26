document.getElementById('authForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const login = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'auth',
                arguments: { login, password },
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.result === 'success') {
            sessionStorage.setItem('account', JSON.stringify({ login: login, name: result.data.name, surname: result.data.surname, skey: result.data.PK, permission_level: result.data.permission_level}))
            window.location.href = result.data.LP;
        } else {
            alert(result.message, 5000, 'error');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});