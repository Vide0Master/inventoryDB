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

async function draw_table(id, rqst) {
    if (id == '') {
        alert("Інвентарний номер не введено", 3000, 'warn')
        return
    }
    const rslts = document.getElementById('results')
    rslts.innerHTML = ''
    document.getElementById('rqst_bar').value = id
    let item = await request('/api/db_interact', "get_item", { col: 'inv_number', value: id })
    switch (rqst) {
        case 'rqst_make': {
            await rqst_make(item, rslts, id)
        }; break;
        case 'rqst_edit': {
            await rqst_edit(item, rslts, id)
        }; break;
        case 'rqst_move': {
            await rqst_move(item, rslts, id)
        }; break;
        case 'rqst_edit_additional_info': {
            await rqst_edit_additional_info(item, rslts, id)
        }; break;
        case 'rqst_delist': {
            await rqst_delist(item, rslts, id)
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

document.getElementById('rqst_edit_additional_info').addEventListener('click', () => {
    draw_table(document.getElementById('rqst_bar').value, 'rqst_edit_additional_info')
})

document.getElementById('rqst_move').addEventListener('click', () => {
    draw_table(document.getElementById('rqst_bar').value, 'rqst_move')
})

document.getElementById('rqst_delist').addEventListener('click', () => {
    draw_table(document.getElementById('rqst_bar').value, 'rqst_delist')
})