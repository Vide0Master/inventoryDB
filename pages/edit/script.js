init_side_bar()

async function init_side_bar() {
    init_dropdown()
}

async function init_dropdown() {
    const content_block = document.querySelector('.content')

    const file_send_block = document.createElement('div')
    content_block.appendChild(file_send_block)

    const file_field = document.createElement('input')
    file_send_block.appendChild(file_field)
    file_field.type = 'file'
    file_field.multiple = true

    const send_button = document.createElement('button')
    file_send_block.appendChild(send_button)
    send_button.innerText = 'Відправити'
    send_button.addEventListener('click', () => {
        uploadFile('/file/upload', file_field, { sex: 'sex' })
    })
}