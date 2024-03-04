const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');
const file_interact = require('../modules/DBFileInteract');
const clog = require('../modules/consoleLogger');

const fileInteract = (req) => {
    return new Promise(async function (resolve) {
        const usr = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE login = "${req.user.login}" AND private_key = "${req.user.key}"`, (err, row) => {
                if (err) {
                    clog(`Помилка бази даних:${err}`,'e');
                    reject(err);
                } else if (!row) {
                    clog(`Помилка авторизації`,'w');
                    reject('Помилка авторизації');
                } else {
                    resolve(row);
                }
            })
        })
        switch (req.type) {
            case 'sendFile': {
                const FAR = file_interact.addFile(req.arguments.file)
                if (FAR == 'err') {
                    resolve({ result: 'error', message: 'Помилка додавання файлу' })
                } else {
                    resolve({ result: 'succ', message: 'Файл успішно додано' })
                }
            }; break;
            case 'getFile': {
                const file = await file_interact.getFile(req.arguments.id)
                resolve({ result: 'succ', file: file })
            }; break;
        }
    })
}

module.exports = fileInteract