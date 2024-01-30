async function render({id, type}) {
    let item = await request('/api/view', type, { id: id })
    switch (type) {
        case 'view_id': {
            if (item.data) {
                item = item.data[0]
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
        }; break;
        case 'view_details': {
            const meta = JSON.parse(item.data[0].meta)
            if(!Object.keys(meta).length>0){
                body.innerText = 'Додаткова інформація відсутня!'
            }else{
                const table = document.createElement('table')
                body.appendChild(table)
                table.innerHTML='<tr><td>Ключ</td><td>Значення</td></tr>'
                for(const key in meta){
                    const row = document.createElement('tr')
                    table.appendChild(row)
                    const name = document.createElement('td')
                    row.appendChild(name)
                    const vall = document.createElement('td')
                    row.appendChild(vall)
                    name.innerText=key
                    vall.innerText=meta[key]
                }
            }
        }; break;
    }
}

const body = document.getElementById('data')
const input = new URLSearchParams(window.location.search)
const inp = { id: input.get('id'), type: input.get('type') }
if (!inp.id || !inp.type) {
    body.innerText = 'Невірний запит!'
} else {
    render(inp)
}