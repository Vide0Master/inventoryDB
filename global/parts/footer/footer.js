const footer_text = ['version', 'organization', 'status', 'csping', 'loading_time']

async function process_footer() {
    const footer = document.getElementsByClassName('footer')[0]
    let dblocks = {}
    footer_text.forEach(line => {
        const ln = document.createElement('div')
        ln.innerHTML = line
        ln.className = line
        dblocks[line] = ln
        footer.appendChild(ln)
    })

    const lver = await request('/api/info', 'latest_ver', '')
    dblocks.version.innerText = lver.data.v
    dblocks.organization.innerText = `Тестовий інвентар`
    const load_time = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
    dblocks.loading_time.innerText = `PLT: ${load_time}мс`
    dblocks.loading_time.style.color = calc_color(load_time)
    async function update_ping() {
        const rqTime = new Date().getTime()
        const result = await request('/api/ping', '', '')
        const rqsTime = new Date().getTime()
        if (result == 'nsr') {
            dblocks.csping.innerText = `PING: >5000мс`
            dblocks.csping.style.color = calc_color(5000)
            dblocks.status.innerText = `Відсутній зв'язок...`
            dblocks.status.style.color = 'rgb(100%,0%,0%)'
        } else {
            dblocks.csping.innerText = `PING: ${rqsTime - rqTime}мс`
            dblocks.csping.style.color = calc_color(rqsTime - rqTime)
            dblocks.status.innerText = `Зв'язок є`
            dblocks.status.style.color = 'rgb(0%,100%,0%)'
        }
    }
    await update_ping()
    setInterval(async () => { await update_ping() }, 5000)
    head_require([
        { type: 'style', link: 'parts/footer/footer.css' }
    ]);
}

function calc_color(perc) {
    return `rgb(${(clamp(perc)) / 3}%, ${(300 - clamp(perc)) / 3}%, 0%)`
}

function clamp(value, min, max) {
    if (value > max) {
        return max
    } else if (value < min) {
        return min
    } else {
        return value
    }
}

process_footer()