
//* File Logger от VideoMaster

const log_to_file = false

const fs = require('fs');
let file = ""
let strgs = [
    "Що зломалось цього разу?",
    "Щось шукаєш?)",
    "ХА! Так і знав що щось зломалось)",
    "Хай бог милує...",
    "Кодер траву не курить!",
    "Матвій, віддай траву!",
    "Наркомани це фронтендери, я фулл-стак, це інший діагноз!",
    "Тут навіть фотошоп не допоможе"
]

class fileLogger {
    static createFile() {
        if (log_to_file) {
            if (!fs.existsSync("./logs")) {
                fs.mkdirSync("./logs");
            }
            let currentdate = new Date();
            let datetime = currentdate.getDate() + "."
                + (currentdate.getMonth() + 1) + "."
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + "."
                + currentdate.getMinutes() + "."
                + currentdate.getSeconds();
            file = `log-[${datetime}].txt`
            fs.appendFileSync(`./logs/${file}`, `Лог консолі від [${datetime}]\n\n"${(strgs[Math.round(Math.random() * strgs.length) - 1])}"\n\n`)
            return `Файловий лог консолі доступний у файлі "${file}" в папці logs, всього лог-файлів:${fs.readdirSync('./logs').length}`
        } else {
            return `Файловий лог консолі не буде записаний у файл, змініть параметр "log_to_file" у файлі "fileLogger.js" у папці "modules"`
        }
    } 
    static writeFile(data) { 
        if (log_to_file) fs.appendFileSync(`./logs/${file}`, `${data}\n`)
    }
};
module.exports = fileLogger;