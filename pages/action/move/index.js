function open_move() {
    const content = document.querySelector('.content')
    const contentCH = content.childNodes
    for (const elm of contentCH) {
        if (!elm.classList.contains('button-row')) {
            content.removeChild(elm)
        }
    }

    const testbtn = document.createElement('button')
    testbtn.innerText='3'
    content.appendChild(testbtn)
}