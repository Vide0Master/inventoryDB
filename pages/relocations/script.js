fetchAllItems()

async function fetchAllItems() {
    const data_elements = {
        numb: '№',
        inv_number: 'Інвентарний номер',
        from: '⇑',
        to: '⇓',
        date: 'Дата'
    }
    const result = await request('/api/db_interact', 'get_all_relocations', '')
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
                case key == 'numb': {
                    box.innerText = iter + 1
                }; break;
                case key == "date": {
                    const date = new Date(item[key] * 1000)
                    let datetime = date.getDate() + "/"
                        + (date.getMonth() + 1) + "/"
                        + date.getFullYear() + " "
                        + date.getHours() + ":"
                        + date.getMinutes() + ":"
                        + date.getSeconds();
                    box.innerText = datetime
                }; break;
                case ['from', 'to'].includes(key): {
                    let txt='';
                    const trnsprt = JSON.parse(item[key])
                    const trn = {
                        cabinet: 'Кабінет: ',
                        workplace: '\nРоб. місце: ',
                        user: '\nКористувач: '
                    }
                    for (const kk in trn) {
                        if (trnsprt[kk] != '') {
                            txt += `${trn[kk]}${trnsprt[kk]}`
                        } else {
                            txt += `${trn[kk]}✕`
                        }
                    }
                    box.innerText = txt
                }; break;
                case item[key] !== '' && item[key] !== null: {
                    box.innerText = item[key]
                }; break;
                default: {
                    box.innerText = '✕'
                }; break;
            }
            row.appendChild(box)
            table.appendChild(row)
        }
    })
    document.getElementById('results').appendChild(table)
}