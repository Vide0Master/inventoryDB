async function draw_table(id, rqst) {
    if (id == '') {
        alert("Інвентарний номер не введено")
        return
    }
    let raw_table = {}
    const rslts = document.getElementById('results')
    rslts.innerHTML = ''
    const data_elements = {
        inv_number: 'Інвентарний номер*',
        item_name: 'Назва*',
        item_type: 'Тип*',
        cost: 'Вартість',
        comment: 'Комментарій',
        cabinet: 'Кабінет/приміщення*',
        workplace: 'Робоче місце',
        user: 'Користувач',
        creation_timestamp: 'Дата створення',
        edit_timestamp: 'Дата оновлення'
    }
    document.getElementById('rqst_bar').value = id
    const table = document.createElement('table')
    let item = await request('/api/db_interact', "get_item", { col: 'inv_number', value: id })
    switch (rqst) {
        case 'rqst_make': {
            if (!item || item.size == 0 || item.result == 'error') {
                for (const key in data_elements) {
                    const row = document.createElement('tr')
                    const fb = document.createElement('td')
                    fb.innerText = data_elements[key]
                    row.appendChild(fb)
                    const sb = document.createElement('td')
                    row.appendChild(sb)
                    if (key == 'item_type') {
                        const select = document.createElement('select')
                        select.id = `field_${key}`
                        select.required = key.endsWith('*')
                        const placeholder = document.createElement('option')
                        placeholder.disabled = true
                        placeholder.selected = true
                        placeholder.innerText = 'Оберіть тип'
                        select.appendChild(placeholder)
                        const result = await request('/api/db_interact', 'get_item_types', '')
                        options = result.data
                        options.forEach(opt => {
                            const optt = document.createElement('option')
                            optt.value = opt
                            optt.innerText = opt
                            select.appendChild(optt)
                        })
                        sb.appendChild(select)
                    } else {
                        const v_field = document.createElement('input')
                        sb.appendChild(v_field)
                        v_field.type = "text"
                        v_field.placeholder = 'Введіть значення'
                        v_field.required = key.endsWith('*')
                        v_field.id = `field_${key}`
                        switch (true) {
                            case key.endsWith('timestamp'): {
                                const date = new Date()
                                let datetime = date.getDate() + "/"
                                    + (date.getMonth() + 1) + "/"
                                    + date.getFullYear() + " "
                                    + date.getHours() + ":"
                                    + date.getMinutes() + ":"
                                    + date.getSeconds();
                                v_field.value = datetime
                                v_field.setAttribute("readonly", "true")
                                raw_table[key] = Math.floor(date.getTime() / 1000)
                                v_field.placeholder = 'Недоступно'
                            }; break;
                            case key == 'inv_number': {
                                v_field.value = id
                                raw_table[key] = id
                                v_field.setAttribute("readonly", "true")
                                v_field.placeholder = 'Недоступно'
                            }; break;
                        }
                    }
                    table.appendChild(row)
                }
                rslts.appendChild(table)
                const button = document.createElement('button')
                button.type = 'button'
                button.innerText = 'Створити'
                button.addEventListener('click', async () => {
                    let local_table = raw_table
                    for (const kk in data_elements) {
                        const itm_val = document.getElementById(`field_${kk}`).value
                        if (itm_val == '' && data_elements[kk].endsWith('*')) {
                            alert(`Поле "${data_elements[kk].slice(0, -1)}" повинно бути заповнене`,5000,'warn')
                            return
                        } else {
                            if (!kk.endsWith('timestamp')) local_table[kk] = itm_val
                        }
                    }
                    const result = await request("/api/db_interact", 'set_item', local_table)
                    alert(result.message, 5000, result.result)
                })
                rslts.appendChild(button)
            } else {
                if (confirm(`Предмет ${id} існує, відредагувати його?`)) {
                    window.location.href = `/edit?id=${id}&type=rqst_edit`
                } else {
                    window.location.href = `/edit`
                }
            }
        }; break;
        case 'rqst_edit': {
            if (item.data.size == 0 || item.result == 'error') {
                if (confirm(`Предмет ${id} не існує, створити його?`)) {
                    window.location.href = `/edit?id=${id}&type=rqst_make`
                } else {
                    window.location.href = `/edit`
                }
            } else {
                let iner_item = item.data[0]
                for (const key in data_elements) {
                    const row = document.createElement('tr')
                    const fb = document.createElement('td')
                    fb.innerText = data_elements[key]
                    row.appendChild(fb)
                    const sb = document.createElement('td')
                    row.appendChild(sb)
                    if (key == 'item_type') {
                        const select = document.createElement('select')
                        select.id = `field_${key}`
                        select.required = key.endsWith('*')
                        select.placeholder = "Оберіть тип"
                        const result = await request('/api/db_interact', 'get_item_types', '')
                        options = result.data
                        options.forEach(opt => {
                            const optt = document.createElement('option')
                            optt.value = opt
                            optt.innerText = opt
                            if (opt == iner_item[key]) optt.selected = true
                            select.appendChild(optt)
                        })
                        sb.appendChild(select)
                    } else {
                        const v_field = document.createElement('input')
                        sb.appendChild(v_field)
                        v_field.type = "text"
                        v_field.placeholder = 'Введіть значення'
                        v_field.required = key.endsWith('*')
                        v_field.id = `field_${key}`
                        switch (true) {
                            case key.endsWith('timestamp'): {
                                const date = new Date(iner_item[key] * 1000)
                                let datetime = date.getDate() + "/"
                                    + (date.getMonth() + 1) + "/"
                                    + date.getFullYear() + " "
                                    + date.getHours() + ":"
                                    + date.getMinutes() + ":"
                                    + date.getSeconds();
                                v_field.value = datetime
                                v_field.setAttribute("readonly", "true")
                                if (key.startsWith('creation')) {
                                    raw_table[key] = Math.floor(date.getTime() / 1000)
                                } else {
                                    raw_table[key] = Math.floor(new Date().getTime() / 1000)
                                }
                                v_field.placeholder = 'Недоступно'
                            }; break;
                            case ['cabinet', 'workplace', 'user', 'inv_number'].includes(key): {
                                v_field.value = iner_item[key]
                                raw_table[key] = iner_item[key]
                                v_field.setAttribute("readonly", "true")
                                v_field.placeholder = 'Недоступно'
                            }; break;
                            case item[key] !== '' && item[key] !== null: {
                                v_field.value = iner_item[key]
                                raw_table[key] = iner_item[key]
                            }; break;
                        }
                    }
                    table.appendChild(row)
                }
                rslts.appendChild(table)
                const button = document.createElement('button')
                button.type = 'button'
                button.innerText = 'Оновити'
                button.addEventListener('click', async () => {
                    let local_table = raw_table
                    for (const kk in data_elements) {
                        const itm_val = document.getElementById(`field_${kk}`).value
                        if (itm_val == '' && data_elements[kk].endsWith('*')) {
                            alert(`Поле "${data_elements[kk].slice(0, -1)}" повинно бути заповнене`, 5000, 'warn')
                            return
                        } else {
                            if (!kk.endsWith('timestamp')) local_table[kk] = itm_val
                        }
                    }
                    const result = await request("/api/db_interact", 'update_item', local_table)
                    alert(result.message, 5000, result.result)
                })
                rslts.appendChild(button)
            }
        }; break;
        case 'rqst_move': {
            if (!item || item.size == 0 || item.result == 'empty') {
                if (confirm(`Предмет ${id} не існує, створити його?`)) {
                    window.location.href = `/edit?id=${id}&type=rqst_make`
                } else {
                    window.location.href = `/edit`
                }
            } else {
                let iner_item = item.data[0]
                for (const key in data_elements) {
                    const row = document.createElement('tr')
                    const fb = document.createElement('td')
                    fb.innerText = data_elements[key]
                    row.appendChild(fb)
                    const sb = document.createElement('td')
                    row.appendChild(sb)
                    const v_field = document.createElement('input')
                    sb.appendChild(v_field)
                    v_field.type = "text"
                    v_field.placeholder = 'Введіть значення'
                    v_field.required = key.endsWith('*')
                    v_field.id = `field_${key}`
                    switch (true) {
                        case key.endsWith('timestamp'): {
                            const date = new Date(iner_item[key] * 1000)
                            let datetime = date.getDate() + "/"
                                + (date.getMonth() + 1) + "/"
                                + date.getFullYear() + " "
                                + date.getHours() + ":"
                                + date.getMinutes() + ":"
                                + date.getSeconds();
                            v_field.value = datetime
                            v_field.setAttribute("readonly", "true")
                            if (key.startsWith('creation')) {
                                raw_table[key] = Math.floor(date.getTime() / 1000)
                            } else {
                                raw_table[key] = Math.floor(new Date().getTime() / 1000)
                            }
                            v_field.placeholder = 'Недоступно'
                        }; break;
                        case ['inv_number', 'item_name', 'item_type', 'comment', 'cost'].includes(key): {
                            v_field.value = iner_item[key]
                            raw_table[key] = iner_item[key]
                            v_field.setAttribute("readonly", "true")
                            v_field.placeholder = 'Недоступно'
                        }; break;
                        case item[key] !== '' && item[key] !== null: {
                            v_field.value = iner_item[key]
                            raw_table[key] = iner_item[key]
                        }; break;
                    }
                    table.appendChild(row)
                }
                rslts.appendChild(table)
                const button = document.createElement('button')
                button.type = 'button'
                button.innerText = 'Перемістити'
                button.addEventListener('click', async () => {
                    let local_table = raw_table
                    local_table['from'] = { cabinet: raw_table.cabinet, workplace: raw_table.workplace, user: raw_table.user }
                    for (const kk in data_elements) {
                        const itm_val = document.getElementById(`field_${kk}`).value
                        if (itm_val == '' && data_elements[kk].endsWith('*')) {
                            alert(`Поле "${data_elements[kk].slice(0, -1)}" повинно бути заповнене`, 5000, 'warn')
                            return
                        } else {
                            if (!kk.endsWith('timestamp')) local_table[kk] = itm_val
                        }
                    }
                    local_table['to'] = { cabinet: local_table.cabinet, workplace: local_table.workplace, user: local_table.user }
                    console.log(local_table)
                    const result = await request("/api/db_interact", 'move_item', local_table)
                    alert(result.message, 5000, result.result)
                })
                rslts.appendChild(button)
            }
        }; break;
        case 'rqst_delist': {

        }; break;
    }
}

const body = document.getElementById('results')
const input = new URLSearchParams(window.location.search)
if (input.get('id') > 0) {
    draw_table(input.get('id'), String(input.get('type')))
}

document.getElementById('rqst_make').addEventListener('click', () => {
    draw_table(document.getElementById('rqst_bar').value, 'rqst_make')
})

document.getElementById('rqst_edit').addEventListener('click', () => {
    draw_table(document.getElementById('rqst_bar').value, 'rqst_edit')
})

document.getElementById('rqst_move').addEventListener('click', () => {
    draw_table(document.getElementById('rqst_bar').value, 'rqst_move')
})

document.getElementById('rqst_delist').addEventListener('click', () => {
    draw_table(document.getElementById('rqst_bar').value, 'rqst_delist')
})