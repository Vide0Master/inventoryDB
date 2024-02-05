process_footer()

function process_footer(){
    const footer_text=[
        'Розробка Олександра Ігнатова',
        'Спеціальне видання для КНП ЦЕМД та МК ЖОР',
        'Розповсюдження та несанкціоноване редагування заборонене',
        'Для технічної пітримки звертатися у телеграмм: <a href="https://t.me/vide0master">@vide0master</a>'
    ]
    const footer = document.getElementsByClassName('footer')[0]
    footer_text.forEach(line=>{
        const ln=document.createElement('div')
        ln.innerHTML=line
        footer.appendChild(ln)
    })
    head_require([
        { type: 'style', link: 'parts/footer/footer.css' }
    ]);
}