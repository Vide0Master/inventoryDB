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
    { type: 'style', link: 'parts/page_structure.css' },
    { type: 'script', link: 'parts/page_list/page_list.js' },
    { type: 'script', link: 'parts/footer/footer.js' },
    { type: 'script', link: 'parts/alert/alert.js' }
]);