render()

async function render() {
    const body = document.getElementById('data')
    const input = new URLSearchParams(window.location.search)
    let item = await request('/api/US_get_id', '', { id: input.get('id') })
    if (item.data) {
        item = item.data[0]
        console.log(item)
        const data_elements = {
            inv_number: 'Інвентарний номер',
            item_name: 'Назва',
            item_type: 'Тип',
            cost: 'Вартість',
            comment: 'Комментарій',
            cabinet: 'Кабінет',
            workplace: 'Робоче місце',
            user: 'Користувач',
            creation_timestamp: 'Дата створення',
            edit_timestamp: 'Дата оновлення'
        }
        const table = document.createElement('table')
        for (const key in data_elements) {
            const row = document.createElement('tr')
            const ftd = document.createElement('td')
            ftd.innerText = data_elements[key]
            row.appendChild(ftd)
            const std = document.createElement('td')
            switch (true) {
                case key == 'numb': {
                    std.innerText = iter + 1
                }; break;
                case key.endsWith('timestamp'): {
                    const date = new Date(item[key] * 1000)
                    let datetime = date.getDate() + "/"
                        + (date.getMonth() + 1) + "/"
                        + date.getFullYear() + " "
                        + date.getHours() + ":"
                        + date.getMinutes() + ":"
                        + date.getSeconds();
                    std.innerText = datetime
                }; break;
                case item[key] !== '' && item[key] !== null: {
                    std.innerText = item[key]
                }; break;
                default: {
                    std.innerText = '✕'
                }; break;
            }
            row.appendChild(std)
            table.appendChild(row)
        }
        body.innerHTML = ''
        body.appendChild(table)
    } else {
        body.innerText = 'Інвентарний номер відсутній у базі!'
    }
}