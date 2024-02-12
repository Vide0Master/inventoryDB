function init_loader() {
    const content = document.querySelector('.content')

    const field = document.createElement('input')
    content.appendChild(field)
    field.type = 'number'
    field.placeholder = 'ID'

    const btn = document.createElement('button')
    content.appendChild(btn)
    btn.innerText = 'Скачати'
    btn.addEventListener('click', () => {
        downloadFile(field.value, 'file')
    })
}

init_loader()