init_reboot_panel()

async function init_reboot_panel() {
    const par_body = document.querySelector('.parameter_blocks')
    const block_body = document.createElement('div')
    block_body.className = 'reboot_panel'
    block_body.id = 'reboot_panel'
    par_body.appendChild(block_body)

    const label = document.createElement('div')
    label.innerHTML = 'Дистанційне перезавантаження системи'
    label.className = 'reboot_label'
    block_body.appendChild(label)

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'reboot_button'
    button.innerText = 'Перезавантажити'
    button.addEventListener('click', async () => {
        if (confirm('Ви точно хочете почати перезавантаження?')) {
            const pass = prompt("Введіть свій пароль:")
            if (pass) {
                const rslt = await request('/api/db_interact', 'reboot_n_update', { rq_type: 'shutdown', pass: pass })
                alert(rslt.message, 4000, rslt.result)
                if (rslt.result == 'warn') {
                    setTimeout(() => {
                        get_server_state(0)
                    }, 10)
                }
            }
        }
    })
    block_body.appendChild(button)
}

async function get_server_state(total_time) {
    const rslt = await request('/api/db_interact', 'reboot_n_update', "")
    if (rslt != 'nsr') {
        alert(rslt.message, 5000, rslt.result)
    } else {
        setTimeout(() => {
            get_server_state(total_time + 1)
        }, 1)
    }
}