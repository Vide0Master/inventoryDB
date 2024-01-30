async function rqst_make(item, rslts, id) {
    const table = document.createElement('table')
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
                    alert(`Поле "${data_elements[kk].slice(0, -1)}" повинно бути заповнене`, 5000, 'warn')
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
}