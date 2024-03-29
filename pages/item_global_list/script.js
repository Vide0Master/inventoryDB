fetchAllItems()

async function fetchAllItems() {
    const data_elements = {
        numb: '№',
        inv_number: 'Інвентарний номер',
        item_name: 'Назва',
        item_type: 'Тип',
        cost:'Вартість',
        comment: 'Комментарій',
        cabinet: 'Кабінет/приміщення',
        workplace: 'Робоче місце',
        user: 'Користувач',
        creation_timestamp: 'Дата створення',
        edit_timestamp: 'Дата оновлення',
        action: 'Дія'
    }
    const result = await request('/api/db_interact', 'get_all_items', '')
    const items = result.data
    const table = document.createElement('table')
    const rw = document.createElement('tr')
    rw.style.color = '#fff'
    rw.style.backgroundColor = '#0066cc'
    for (const key in data_elements) {
        const box = document.createElement('td')
        box.innerText = data_elements[key]
        rw.appendChild(box)
    }
    table.appendChild(rw)
    items.forEach((item, iter) => {
        const row = document.createElement('tr')
        for (const key in data_elements) {
            const box = document.createElement('td')
            switch (true) {
                case key == 'action': {
                    const select = document.createElement('select')
                    const placeholder = document.createElement('option')
                    placeholder.disabled = true
                    placeholder.selected = true
                    placeholder.innerText = 'Оберіть дію'
                    select.appendChild(placeholder)
                    const actions = {
                        print_view: 'Переглянути у "PFM"',
                        rqst_edit: 'Редагувати предмет',
                        rqst_move: 'Перемістити предмет',
                        rqst_delist: 'Списати предмет'
                    }
                    for (const key in actions) {
                        const action = document.createElement('option')
                        action.value = key
                        action.innerText = actions[key]
                        select.appendChild(action)
                    }
                    box.addEventListener('change', () => {
                        switch (select.value) {
                            case 'print_view': {
                                window.open(`/view?id=${item.inv_number}`, '_blank', 'width=600,height=800')
                                select.selectedIndex = 0
                            }; break;
                            case 'rqst_edit': {
                                window.location.href = `/edit?id=${item.inv_number}&type=rqst_edit`
                            }; break;
                            case 'rqst_move': {
                                window.location.href = `/edit?id=${item.inv_number}&type=rqst_move`
                            }; break;
                            case 'rqst_delist': {
                                window.location.href = `/edit?id=${item.inv_number}&type=rqst_delist`
                            }; break;
                        }
                    })
                    box.appendChild(select)
                }; break;
                case key == 'numb': {
                    box.innerText = iter + 1
                }; break;
                case key.endsWith('timestamp'): {
                    const date = new Date(item[key] * 1000)
                    let datetime = date.getDate() + "/"
                        + (date.getMonth() + 1) + "/"
                        + date.getFullYear() + " "
                        + date.getHours() + ":"
                        + date.getMinutes() + ":"
                        + date.getSeconds();
                    box.innerText = datetime
                }; break;
                case item[key] !== '' && item[key] !== null: {
                    box.innerText = item[key]
                }; break;
                default: {
                    box.innerText = '✕'
                }; break;
            }
            switch (true) {
                case ['inv_number', 'item_name', 'item_type', 'comment', 'cost'].includes(key): {
                    box.addEventListener('dblclick', () => {
                        window.location.href = `/edit?id=${item.inv_number}&type=rqst_edit`
                    })
                }; break;
                case ['cabinet', 'workplace', 'user'].includes(key): {
                    box.addEventListener('dblclick', () => {
                        window.location.href = `/edit?id=${item.inv_number}&type=rqst_move`
                    })
                }; break;
            }
            row.appendChild(box)
            table.appendChild(row)
        }
    })
    document.getElementById('results').appendChild(table)
}