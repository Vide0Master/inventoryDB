function open_create() {
    function check_field(e) {
        const elem = e.target
        if (['', '0'].includes(elem.value.toString().trim())) {
            elem.style.borderColor = 'red'
        } else {
            elem.style.borderColor = 'green'
        }
    }

    const content = document.querySelector('.content')
    const contentCH = content.childNodes
    for (let i = 0; i < contentCH.length; i++) {
        const elm = contentCH[i]
        if (!elm.classList.contains('button-row')) {
            content.removeChild(elm)
        }
    }

    const blck_zone = document.createElement('div')
    content.appendChild(blck_zone)
    blck_zone.className = 'creation-block'


    const dat_types = [
        { name: 'Інвентарний номер', tag: 'IN' },
        { name: 'Назва', tag: 'NM' },
        { name: 'Тип', tag: 'TP' },
        { name: 'Ціна', tag: 'CS' },
        { name: 'Коментарій', tag: 'CM' },
        { name: 'Статус', tag: 'ST' },
        { name: 'Додати файли', tag: 'AF' },
        { name: 'Додати запис', tag: 'AC' },
    ]

    let fields = {
        item: {
            inv_number: null,
            item_name: null,
            item_type: null,
            cost: null,
            comment: null,
            status: null
        },
        files: null
    }
    const item_zone = document.createElement('div')
    item_zone.className = 'item-zone'
    blck_zone.appendChild(item_zone)

    const create_file_label = document.createElement('div')
    item_zone.appendChild(create_file_label)
    create_file_label.innerText = 'Додавання інвентарного запису'
    create_file_label.className = 'create-file-label'

    const data_fields = document.createElement('div')
    item_zone.appendChild(data_fields)
    data_fields.className = 'data-fields'

    dat_types.forEach(async (field) => {
        const data_field = document.createElement('div')
        data_fields.appendChild(data_field)
        data_field.className = 'item-field'
        switch (field.tag) {
            case 'IN': {
                const input = document.createElement('input')
                input.style.borderColor = 'orange'
                data_field.appendChild(input)
                input.type = 'number'
                input.placeholder = field.name
                fields.item.inv_number = input
                input.addEventListener('change', async () => {
                    const id_state = await request('/api/inevntory_interact', 'checkID', { id: input.value })
                    if (id_state.result) {
                        alert(`Інвентарний номер ${input.value} зайнято!`, 2500, 'error')
                        input.style.borderColor = 'red'
                    } else {
                        input.style.borderColor = 'green'
                    }
                    if (['', '0'].includes(input.value.toString().trim())) { input.style.borderColor = 'red' }
                })
            }; break;
            case 'NM': {
                const input = document.createElement('input')
                input.style.borderColor = 'orange'
                data_field.appendChild(input)
                input.type = 'text'
                input.placeholder = field.name
                fields.item.item_name = input
                input.addEventListener('change', (e) => check_field(e))
            }; break;
            case 'TP': {
                const input = document.createElement('select')
                input.style.borderColor = 'orange'
                data_field.appendChild(input)
                const placeholder = document.createElement('option')
                input.appendChild(placeholder)
                placeholder.value = ''
                placeholder.disabled = true
                placeholder.selected = true
                placeholder.hidden = true
                placeholder.innerText = 'Оберіть тип'

                const response = await request('/api/getSettings', 'IIT')
                response.data.forEach(val => {
                    const opt = document.createElement('option')
                    input.appendChild(opt)
                    opt.value = val.value
                    opt.innerText = val.value
                })
                fields.item.item_type = input
                input.addEventListener('change', (e) => check_field(e))
            }; break;
            case 'CS': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type = 'number'
                input.placeholder = field.name
                fields.item.cost = input
            }; break;
            case 'CM': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type = 'text'
                input.placeholder = field.name
                fields.item.comment = input
            }; break;
            case 'ST': {
                const input = document.createElement('select')
                input.style.borderColor = 'orange'
                data_field.appendChild(input)
                const placeholder = document.createElement('option')
                input.appendChild(placeholder)
                placeholder.value = ""
                placeholder.disabled = true
                placeholder.selected = true
                placeholder.hidden = true
                placeholder.innerText = 'Оберіть стан'

                const response = await request('/api/getSettings', 'ISTATE')
                response.data.forEach(val => {
                    const opt = document.createElement('option')
                    input.appendChild(opt)
                    opt.value = val.value
                    opt.innerText = val.value
                })
                fields.item.status = input
                input.addEventListener('change', (e) => check_field(e))
            }; break;
            case 'AF': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type = 'button'
                input.value = field.name
                input.addEventListener('click', () => {
                    input.disabled = true
                    const file_zone = document.createElement('div')
                    blck_zone.appendChild(file_zone)
                    file_zone.className = 'file-block'
                    const text_blck = document.createElement('div')
                    file_zone.appendChild(text_blck)
                    text_blck.innerText = 'Файли'
                    text_blck.className = 'text'
                    fields.files = createFileUploadContainer(file_zone)
                })
            }; break;
            case 'AC': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type = 'button'
                input.value = field.name
                input.addEventListener('click', async () => {
                    let trasnport_container = {
                        item: {
                            inv_number: null,
                            item_name: null,
                            item_type: null,
                            cost: null,
                            comment: null,
                            status: null
                        },
                        files: null
                    }
                    let err = false
                    let itr = 0
                    for (const item in fields.item) {
                        const itm = fields.item[item]
                        trasnport_container.item[item] = itm.value
                        const bcol = itm.style.borderColor
                        if (['red', 'orange'].includes(bcol)) {
                            switch (bcol) {
                                case 'red': alert(`Невірне значення поля ${dat_types[itr].name}`, 0, 'error'); break;
                                case 'orange': alert(`Значення поля ${dat_types[itr].name} не введено`, 0, 'warn'); break;
                            }
                            err = true
                        }
                        itr++
                    }
                    try {
                        const fls = await fields.files()
                        if (fls.size == 0) {
                            alert(`Не було обрано жодного файлу завантаження`, 5000, 'error')
                            return
                        }
                        if(fls=='err') err=true
                        trasnport_container.files = fls
                    } catch { }
                    if (err) return
                    console.log(trasnport_container)
                    const response = await request('/api/inevntory_interact','createItem',trasnport_container)
                    alert(response.message, 5000, response.result)
                })
            }; break;
        }
    })
}