set_pages_list()

async function set_pages_list() {
    const pages = await request('/api/page_list', "", "")
    const button_block = document.getElementById('buttons')
    const pg_lbl = document.getElementById('page_label_text')
    pg_lbl.addEventListener('click', () => {
        const bttn_col = document.getElementById('page_label')
        bttn_col.className == 'page_label open' ? bttn_col.className = 'page_label' : bttn_col.className = 'page_label open'
    })
    pages.data.forEach((v) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.addEventListener('click', () => {
            window.location.href = '/'+v.link
        })
        button.innerText = v.name
        if (v.link == window.location.pathname.slice(1, -1)) {
            button.disabled = true
            pg_lbl.innerText = v.name
        }
        button_block.appendChild(button)
    })
}