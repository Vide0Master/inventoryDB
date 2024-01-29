const user_data_template = {
    login: `Логін`,
    password: `Пароль`,
    surname: `Фамілія`,
    name: `Ім'я`,
    permission_level: `Рівень доступу`,
    delete: 'Видалити'
}

init_user_manager()

async function init_user_manager() {
    const par_body = document.querySelector('.parameter_blocks')
    const block_body = document.createElement('div')
    block_body.className = 'user_manager'
    block_body.id = 'user_manager'
    par_body.appendChild(block_body)

    const block_label = document.createElement('div')
    block_label.innerText = 'Керування користувачами'
    block_label.className = 'label'
    block_body.appendChild(block_label)

    const table_block = document.createElement('div')
    table_block.className = 'table_block'
    block_body.appendChild(table_block)
    render_table(table_block)

    const user_register_block = document.createElement('div')
    user_register_block.className = 'user_reg'
    block_body.appendChild(user_register_block)
    let user_fields = {}
    for (const key in user_data_template) {
        if (key != 'delete') {
            const inp = document.createElement('input')
            inp.type = 'text'
            inp.placeholder = user_data_template[key]
            user_register_block.appendChild(inp)
            user_fields[key] = inp
        }
    }
    const usr_reg_button = document.createElement('button')
    usr_reg_button.type = 'button'
    usr_reg_button.innerText = 'Створити користувача'
    user_register_block.appendChild(usr_reg_button)
    usr_reg_button.addEventListener('click', async () => {
        let reg_user = {}
        for (const k in user_fields) {
            reg_user[k] = user_fields[k].value
        }
        const result = await request('/api/db_interact', 'create_user', reg_user)
        alert(result.message, 4000, result.result)
        if (result.result == 'succ') render_table(table_block)
    })
}

async function render_table(table_block) {
    table_block.innerText = ''
    const users = await request('/api/db_interact', 'get_all_users')
    const table = document.createElement('table')
    table_block.appendChild(table)
    const main_row = document.createElement('tr')
    table.appendChild(main_row)
    for (const key in user_data_template) {
        const td = document.createElement('td')
        td.innerText = user_data_template[key]
        main_row.appendChild(td)
    }
    users.data.forEach(user => {
        const row = document.createElement('tr')
        for (const key in user_data_template) {
            const td = document.createElement('td')
            row.appendChild(td)
            if (key == 'delete') {
                const delete_button = document.createElement('button')
                delete_button.type = 'button'
                delete_button.innerText = `Видалити ${user.login}`
                td.appendChild(delete_button)
                delete_button.addEventListener('click', async () => {
                    const result = await request('/api/db_interact', 'delete_user', { login: user.login })
                    alert(result.message, 4000, result.result)
                    if (result.result == 'succ') render_table(table_block)
                })
            } else {
                td.innerText = user[key]
                if (key == 'password') td.className = 'password'

                let is_processed = false
                td.addEventListener('click', (ev) => {
                    const field = document.createElement('input')
                    field.type = 'text'
                    field.value = ev.target.innerText
                    const preval = ev.target.innerText
                    td.innerText = ''
                    td.appendChild(field)
                    field.focus()
                    field.addEventListener('keydown', async (e) => {
                        is_processed=true
                        if (e.key == 'Enter') {
                            const fval = field.value
                            const result = await request(
                                '/api/db_interact',
                                'update_user_parameter',
                                { user: user.login, ftype: [key], value: fval }
                            )
                            alert(result.message, 5000, result.result)
                            if (result.result === 'succ') {
                                td.innerText = fval
                            } else {
                                td.innerText = preval
                            }
                        }
                    })
                    field.addEventListener('focusout', (e) => {
                        if (!is_processed) td.innerText = preval
                    })
                })
            }
        }
        table.appendChild(row)
    });
}