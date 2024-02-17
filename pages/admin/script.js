function init_loader() {
    const content = document.querySelector('.content')

    const field = document.createElement('input')
    content.appendChild(field)
    field.type = 'number'
    field.placeholder = 'ID'

    const btnl = document.createElement('button')
    content.appendChild(btnl)
    btnl.innerText = 'Скачати'
    btnl.addEventListener('click', async () => {
        downloadFile(field.value, 'file')
    })

    const btnsw = document.createElement('button')
    content.appendChild(btnsw)
    btnsw.innerText = 'Показати'
    btnsw.addEventListener('click', async () => {
        await downloadFile(field.value, 'data')
            .then((value) => {
                const img = document.createElement('img')
                content.appendChild(img)
                img.src=value
                
            })
            .catch((error) => {
                console.error('Error loading scripts or styles:', error);
            });

    })
}

init_loader()