function open_create() {
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

    const create_file_label = document.createElement('div')
    blck_zone.appendChild(create_file_label)
    create_file_label.innerText = 'Додавання інвентарного запису'
    create_file_label.className = 'create_file_label'

    const dat_types = [
        { name: 'Інвентарний номер', tag: 'IN' },
        { name: 'Назва', tag: 'NM' },
        { name: 'Тип', tag: 'TP' },
        { name: 'Ціна', tag: 'CS' },
        { name: 'Коментарій', tag: 'CM' },
        { name: 'Статус', tag: 'ST' },
        { name: 'Додати документ', tag: 'AD' },
        { name: 'Додати фото', tag: 'AP' },
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
        docs: null,
        photo: null
    }

    dat_types.forEach(async (field) => {
        const data_field = document.createElement('div')
        blck_zone.appendChild(data_field)
        data_field.className = 'item-field'
        switch (field.tag) {
            case 'IN': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type='number'
                input.placeholder=field.name
            }; break;
            case 'NM': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type='text'
                input.placeholder=field.name
            }; break;
            case 'TP': {
                const input = document.createElement('select')
                data_field.appendChild(input)
                const placeholder=document.createElement('option')
                input.appendChild(placeholder)
                placeholder.value=""
                placeholder.disabled=true
                placeholder.selected=true
                placeholder.hidden=true
                placeholder.innerText='Оберіть тип'

                const response = await request('/api/getSettings','IIT')
                response.data.forEach(val=>{
                    const opt = document.createElement('option')
                    input.appendChild(opt)
                    opt.value=val.value
                    opt.innerText=val.value
                })
            }; break;
            case 'CS': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type='number'
                input.placeholder=field.name
            }; break;
            case 'CM': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type='text'
                input.placeholder=field.name
            }; break;
            case 'ST': {
                const input = document.createElement('select')
                data_field.appendChild(input)
                const placeholder=document.createElement('option')
                input.appendChild(placeholder)
                placeholder.value=""
                placeholder.disabled=true
                placeholder.selected=true
                placeholder.hidden=true
                placeholder.innerText='Оберіть стан'

                const response = await request('/api/getSettings','ISTATE')
                response.data.forEach(val=>{
                    const opt = document.createElement('option')
                    input.appendChild(opt)
                    opt.value=val.value
                    opt.innerText=val.value
                })
            }; break;
            case 'AD': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type='button'
                input.value='Додати документ'
            }; break;
            case 'AP': {
                const input = document.createElement('input')
                data_field.appendChild(input)
                input.type='button'
                input.value='Додати фото'
            }; break;
        }
    })
}