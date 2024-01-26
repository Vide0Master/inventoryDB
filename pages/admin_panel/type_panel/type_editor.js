init_type_editor()

async function init_type_editor() {
    const block_body = document.getElementById('type_editor')

    const par_label = document.createElement('div')
    par_label.innerText = 'Редагування типів'
    par_label.className = 'parameter_label'
    block_body.appendChild(par_label)

    const adder_row = document.createElement('form')
    adder_row.className = 'adder-form'
    block_body.appendChild(adder_row)

    const upd_field = document.createElement('input')
    upd_field.type = 'text'
    upd_field.placeholder = 'Введіть назву типу'
    upd_field.id = 'type_insert_value'
    adder_row.appendChild(upd_field)

    const upd_button = document.createElement('button')
    upd_button.innerText = 'Додати'
    adder_row.appendChild(upd_button)

    const type_table = document.createElement('table')
    await fill_type_table(type_table)
    block_body.appendChild(type_table)

    upd_button.addEventListener('click', async (e) => {
        e.preventDefault()
        const ntype = document.getElementById('type_insert_value').value
        if (!ntype || ntype == '') {
            alert('Поле типу повинно бути заповнене', 4000, "warn")
        } else {
            const rtr = await request('/api/db_interact', 'edit_item_types', { type: 'add', name: ntype })
            alert(rtr.data.message, 4000, rtr.data.msg_type)
            await fill_type_table(type_table)
            document.getElementById('type_insert_value').value=""
        }
    })
}

async function fill_type_table(table) {
    const types = await request('/api/db_interact', 'get_item_types')
    table.innerHTML = ''
    types.data.forEach(typ => {
        const tr = document.createElement('tr')
        const name = document.createElement('td')
        name.innerText = typ
        tr.appendChild(name)
        const rm_bl = document.createElement('td')
        tr.appendChild(rm_bl)
        const rm_butt = document.createElement('button')
        rm_butt.type = 'button'
        rm_bl.appendChild(rm_butt)
        rm_butt.innerText = 'Видалити'
        rm_butt.addEventListener('click', async () => {
            const rtr = await request('/api/db_interact', 'edit_item_types', { type: 'remove', name: typ })
            alert(rtr.data.message, 4000, rtr.data.msg_type)
            await fill_type_table(table)
        })
        table.appendChild(tr)
    });
}