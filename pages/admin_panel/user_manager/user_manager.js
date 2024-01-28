init_user_manager()

async function init_user_manager() {
    const par_body = document.querySelector('.parameter_blocks')
    console.log(par_body)
    const block_body = document.createElement('div')
    block_body.className = 'user_manager'
    block_body.id = 'user_manager'
    par_body.appendChild(block_body)

    const block_label = document.createElement('div')
    block_label.innerText='Керування користувачами'
    block_label.className='label'
    block_body.appendChild(block_label)
}