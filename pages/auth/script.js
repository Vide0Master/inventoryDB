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
            sessionStorage.setItem('account', JSON.stringify({ login: login, name: result.data.name, surname: result.data.surname, skey: result.data.PK, permission_level: result.data.permission_level }))
            window.location.href = result.data.LP;
        } else {
            alert(result.message, 5000, 'error');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "F9") {
        const overlay = document.createElement('div')
        overlay.className = 'overlay'
        document.body.appendChild(overlay)
        const shade = document.createElement('div')
        overlay.appendChild(shade)
        shade.className = 'shade'
        shade.addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s'
            overlay.addEventListener('animationend', () => {
                overlay.remove()
            })
        })
        const block = document.createElement('div')
        overlay.appendChild(block)
        block.className = 'mkey-login-block'
        const label = document.createElement('div')
        block.appendChild(label)
        label.innerText = 'MKEY AUTH'
        label.className = 'label'
        const input = document.createElement('input')
        block.appendChild(input)
        input.className = 'input'
        input.type = 'text'
        input.focus()
        input.addEventListener('keyup', async (e) => {
            if (e.key == 'Enter') {
                try {
                    const response = await fetch('/api/auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type:'mkeyAuth',
                            mkey:input.value
                        }),
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    if (result.result === 'success') {
                        sessionStorage.setItem('account', JSON.stringify({ login: result.data.login, name: result.data.name, surname: result.data.surname, skey: result.data.PK, permission_level: result.data.permission_level }))
                        window.location.href = result.data.LP;
                    } else {
                        alert(result.message, 5000, 'error');
                    }
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                }
            }
        })
    }
});

