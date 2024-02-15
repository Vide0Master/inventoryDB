fetch_instructions()
fetch_updates()

async function fetch_updates() {
    const upd_field = document.createElement('div')
    upd_field.className = 'updates'
    document.querySelector('.content').appendChild(upd_field)
    const updates = await request('/api/info', 'all_updates', '')
    updates.data.forEach(upd => {
        const upd_block = document.createElement('div')
        upd_block.className = 'upd_block'
        upd_field.appendChild(upd_block)

        const upd_ver = document.createElement('div')
        upd_ver.className = 'upd_ver'
        upd_ver.innerText = upd.v
        upd_block.appendChild(upd_ver)

        const upd_desc = document.createElement('div')
        upd_desc.className = 'upd_desc'
        upd_block.appendChild(upd_desc)

        upd.desc.forEach(desc_line => {
            const desc_line_div = document.createElement('div')
            desc_line_div.innerText = desc_line
            upd_desc.appendChild(desc_line_div)
        })
    });
    await head_require([{ type: 'style', link: 'updates.css' }])
}

async function fetch_instructions() {
    const info_zone = document.createElement('div')
    document.querySelector('.content').appendChild(info_zone)
    info_zone.className = 'info_zone'
    const instructions = await request('/api/info', 'instruction', '')
    instructions.data.forEach(block => {
        const paragraph = document.createElement('div')
        info_zone.appendChild(paragraph)
        paragraph.className = 'paragraph'

        const paragraph_name = document.createElement('div')
        paragraph.appendChild(paragraph_name)
        paragraph_name.innerText = block.paragraph_name
        paragraph_name.className = 'paragraph_name'

        const paragraph_subs = document.createElement('div')
        paragraph.appendChild(paragraph_subs)
        paragraph_subs.className = 'paragraph_subs'

        block.sub_paragraphs.forEach(sblock => {
            const sub_paragraph = document.createElement('div')
            paragraph_subs.appendChild(sub_paragraph)
            sub_paragraph.className = 'sub_paragraph'

            const sub_paragraph_name = document.createElement('div')
            sub_paragraph.appendChild(sub_paragraph_name)
            sub_paragraph_name.innerText = sblock.name
            sub_paragraph_name.className = 'sub_paragraph_name'

            const sub_paragraph_text = document.createElement('div')
            sub_paragraph.appendChild(sub_paragraph_text)
            sub_paragraph_text.innerText = sblock.text
            sub_paragraph_text.className = 'sub_paragraph_text'
        })
    })
    await head_require([{ type: 'style', link: 'info.css' }])
}