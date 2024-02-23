const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');
const file_interact = require('../modules/DBFileInteract')

const fileInteract = (req) => {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM users WHERE login = "${req.user.login}" AND private_key = "${req.user.key}"`, (err, row) => {
            if (err) {
                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
            } else if (row) {
                switch (req.type) {
                    case 'sendFile': {
                        const FAR = file_interact.addFile(req.arguments.file)
                        if(FAR=='err'){
                            resolve({ result: 'error', message: 'Помилка додавання файлу' })
                        }else{
                            resolve({ result: 'succ', message: 'Файл успішно додано' })
                        }
                    }; break;
                    case 'getFile': {
                        file_interact.getFile(req.id)
                    }; break;
                }
            } else {
                resolve({ result: 'error', message: 'Помилка аутентифікації' });
            }
        })
    })
}

module.exports = fileInteract