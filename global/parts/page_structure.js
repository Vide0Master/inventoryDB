init_page_struct()

function init_page_struct() {
    const structure = [
        { element: 'div', style: 'header' },
        { element: 'div', style: 'content' },
        { element: 'div', style: 'footer' }
    ]

    const body = document.getElementsByTagName('body')[0]

    structure.forEach(part => {
        const block = document.createElement(part.element)
        block.className = part.style
        body.appendChild(block)
    })

    head_require([
        { type: 'script', link: 'request.js' },
        { type: 'script', link: 'sendFile.js' },
        { type: 'script', link: 'getFile.js' },
        { type: 'script', link: 'parts/upload_zone/upload_zone.js' },
        { type: 'script', link: 'parts/page_list/page_list.js' },
        { type: 'style', link: 'parts/page_structure.css' },
        { type: 'script', link: 'parts/footer/footer.js' },
        { type: 'script', link: 'parts/alert/alert.js' },
        { type: 'script', link: 'parts/user_card/user_card.js' },
        { type: 'script', link: 'script.js' }
    ]).then()
}