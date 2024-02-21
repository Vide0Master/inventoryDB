function open_create() {
    const content = document.querySelector('.content')
    const contentCH = content.childNodes
    for (let i = 0; i < contentCH.length; i++) {
        const elm = contentCH[i]
        if (!elm.classList.contains('button-row')) {
            content.removeChild(elm)
        }
    }

    const testbtn = document.createElement('button')
    testbtn.innerText='1'
    createFileUploadContainer(content)
}