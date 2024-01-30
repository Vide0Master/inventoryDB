async function rqst_move(item, rslts, id) {
    let raw_table = {}
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
}