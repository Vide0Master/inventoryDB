process_user_card()

function process_user_card() {
    const acc_level = ['Оператор', 'Адміністратор']
    const account = JSON.parse(sessionStorage.getItem('account'))
    let usr_name = ''
    if (account.name && !account.surname) {
        usr_name += ` ${account.name}`
    } else if (account.name) {
        usr_name += `${account.name}`
    }

    const header = document.querySelector('.header')

    const header_user_card = document.createElement('div')

    header.appendChild(header_user_card)
    header_user_card.className = 'header_user_card'

    const username = document.createElement('div')
    username.className = 'username'
    if (!account.name && !account.surname) {
        username.innerText = account.login
    } else {
        username.innerText = `${usr_name} (${account.login})`
    }
    header_user_card.appendChild(username)

    const button_row = document.createElement('div')
    header_user_card.appendChild(button_row)
    button_row.className = 'button_row'

    const deauth_button = document.createElement('button')
    button_row.appendChild(deauth_button)
    deauth_button.innerText = '⇐ Вийти'
    deauth_button.addEventListener('click', () => {
        sessionStorage.clear()
        window.location.href = '/';
    })

    const info_button = document.createElement('button')
    button_row.appendChild(info_button)
    info_button.innerText = 'Інформація'
    info_button.addEventListener('click', () => {
        const overlay = document.createElement('div')

        overlay.className = 'overlay'
        document.body.appendChild(overlay)
        const shade = document.createElement('div')
        overlay.appendChild(shade)
        shade.className='shade'
        const info_block = document.createElement('div')
        info_block.className = 'info_block'
        overlay.appendChild(info_block)
        shade.addEventListener('click',()=>{
            overlay.style.animation='fadeOut 0.3s'
            overlay.addEventListener('animationend',()=>{
                overlay.remove()
            })
        })
        const fields=[
            {name:`Ім'я:`,value:''},
            {name:`Логін:`,value:account.login},
            {name:`Ранг:`,value:acc_level[account.permission_level]},
            {name:`Секретний ключ:`,value:account.skey}
        ]
        if (!account.name && !account.surname) {
            fields[0].value = 'Відсутнє'
        } else {
            fields[0].value = usr_name
        }
        fields.forEach(field=>{
            const fblock=document.createElement('div')
            info_block.appendChild(fblock)
            fblock.className='fblock'
            const fname=document.createElement('div')
            fblock.appendChild(fname)
            fname.className='fname'
            fname.innerText=field.name
            const fval=document.createElement('div')
            fblock.appendChild(fval)
            fval.className='fval'
            fval.innerText=field.value
        })
    })

    head_require([
        { type: 'style', link: 'parts/user_card/user_card.css' }
    ]);
}
