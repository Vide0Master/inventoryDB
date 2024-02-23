function open_edit() {
    const content = document.querySelector('.content')
    const contentCH = content.childNodes
    for (const elm of contentCH) {
        if (!elm.classList.contains('button-row')) {
            content.removeChild(elm)
        }
    }

    createFileUploadContainer(content)
}