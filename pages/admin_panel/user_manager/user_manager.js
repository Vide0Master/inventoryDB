
init_user_manager()

const user_data_template = {
    login: `Логін`,
    password: `Пароль`,
    surname: `Фамілія`,
    name: `Ім'я`,
    permission_level: `Рівень доступу`,
    last_page: `Остання сторінка`
}

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
}

async function render_table(table_block) {
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
            td.innerText = user[key]
            row.appendChild(td)
            td.addEventListener('click', () => {
                td.innerText = ''
                const field = document.createElement('input')
                field.type = 'text'
                field.value = user[key]
                td.appendChild(field)
                field.focus()
                field.addEventListener('keydown', async (e) => {
                    if (e.key == 'Enter') {
                        const fval = field.value
                        const result = await request(
                            '/api/db_interact',
                            'update_user_parameter',
                            { user: user.login, ftype: [key], value: fval }
                        )
                        alert(result.message, 5000, result.result)
                        if (result.result == 'succ') {
                            td.innerText = fval
                        } else {
                            td.innerText = user[key]
                        }
                    }
                })
                field.addEventListener('blur', () => {
                    field.remove()
                    td.innerText = user[key]
                })
            })
        }
        table.appendChild(row)
    });
}