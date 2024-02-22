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
    blck_zone.className='creation-block'

    const create_file_label = document.createElement('div')
    blck_zone.appendChild(create_file_label)
    create_file_label.innerText='Створити інвентарний запис'
    create_file_label.className='create_file_label'
}