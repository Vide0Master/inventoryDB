get_user_data()

async function get_user_data() {
    const acc_level = ['Глядач', 'Молодший оператор', 'Старший оператор', 'Супер адміністратор']
    const account = JSON.parse(sessionStorage.getItem('account'))
    const usr_main_field = document.getElementById('profile')
    const user_card = {
        name: document.getElementById('name'),
        login: document.getElementById('login'),
        permission_level: document.getElementById('adm_lvl'),
        secret_key: document.getElementById('secret_key')
    }
    let usr_name = `${account.surname}`;
    if (['', null].includes(account.name) && ['', null].includes(account.surname)) {
        usr_name += ` ${account.name}`
    } else if (['', null].includes(account.name)) {
        usr_name += `${account.name}`
    }
    if (['', null].includes(account.name) && ['', null].includes(account.surname)) {
        usr_main_field.innerText = account.login
    } else {
        usr_main_field.innerText = `${usr_name} (${account.login})`
    }
    if (['', null].includes(account.name) && ['', null].includes(account.surname)) {
        user_card.name.innerText = 'Відсутнє'
    } else {
        user_card.name.innerText = usr_name
    }
    user_card.login.innerText = account.login
    user_card.permission_level.innerText = acc_level[account.permission_level]
    user_card.secret_key.innerText = account.skey
}

document.getElementById('logout').addEventListener('click', () => {
    sessionStorage.clear()
    window.location.href = '/';
})

document.getElementById('profile_info').addEventListener('click', async () => {
    let itm = document.getElementById('user_info')
    itm.style.display = "block"
})

document.getElementById('user_card_close').addEventListener('click', async () => {
    let itm = document.getElementById('user_info')
    itm.style.display = "none"
})