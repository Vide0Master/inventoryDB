const buttons = [
    { name: 'Створити', action: 'open_create()' },
    { name: 'Редагувати', action: 'open_edit()' },
    { name: 'Перемістити', action: 'open_move()' }
]

init_page()

async function init_page() {
    const content = document.querySelector('.content')

    const buttonRow = document.createElement('div')
    buttonRow.className = 'button-row'
    content.appendChild(buttonRow)

    buttons.forEach(butt => {
        const button = document.createElement('button')
        button.innerText = butt.name
        button.addEventListener('click',()=>eval(butt.action))
        buttonRow.appendChild(button)
    })
}

head_require([
    { type: 'script', link: 'create/index.js' },
    { type: 'style', link: 'create/style.css' },
    { type: 'script', link: 'edit/index.js' },
    { type: 'style', link: 'edit/style.css' },
    { type: 'script', link: 'move/index.js' },
    { type: 'style', link: 'move/style.css' },
    { type: 'style', link: 'style.css' }
])