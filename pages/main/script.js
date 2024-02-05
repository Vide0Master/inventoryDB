fetch_updates()

async function fetch_updates() {
    const upd_field = document.createElement('div')
    document.querySelector('.content').appendChild(upd_field)
    const updates = await request('/api/upd_info','all_updates','')
    updates.data.forEach(upd => {
        const upd_block = document.createElement('div')
        upd_block.className='upd_block'
        upd_field.appendChild(upd_block)
        const upd_ver = document.createElement('div')
        upd_ver.className = 'upd_ver'
        upd_ver.innerText= upd.v
        upd_block.appendChild(upd_ver)
        const upd_desc = document.createElement('div')
        upd_desc.className = 'upd_desc'
        upd_block.appendChild(upd_desc)
        upd.desc.forEach(desc_line=>{
            const desc_line_div = document.createElement('div')
            desc_line_div.innerText = desc_line
            upd_desc.appendChild(desc_line_div)
        })
    });
}