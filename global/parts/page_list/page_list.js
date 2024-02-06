
set_pages_list()

async function set_pages_list() {
    const header = document.querySelector('.header')
    const button_block = document.createElement('div')
    header.append(button_block)
    button_block.className = 'page_list'
    const pages = await request('/api/page_list', "", "")
    pages.data.forEach((v) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.addEventListener('click', () => {
            window.location.href = '/' + v.link
        })
        button.innerText = v.name
        if (v.link == window.location.pathname.slice(1, -1)) {
            button.disabled = true
        }
        button_block.appendChild(button)
    })
}

head_require([
    { type: 'style', link: 'parts/page_list/page_list.css' }
]);