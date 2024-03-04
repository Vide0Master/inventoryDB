const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');
const clog = require('./consoleLogger')

function get_id_limit() {
    return new Promise((resolve) => {
        let lim = 9999;
        db.get(`SELECT * FROM settings WHERE key = "IDFieldLimit"`, (err, row) => {
            if (err) {
                clog(`Помилка запиту БД: ${err}`, 'e')
                resolve(lim)
            } else if (row) {
                resolve(row.value)
            } else {
                clog('В налаштуваннях відсутній параметр "IDFieldLimit", використано статичне значення "9999", Змініть налаштування системи щоб прибрати це повідомлення', 'w')
                resolve(lim)
            }
        })
    })
}

function checkID(id) {
    db.get(`SELECT * FROM storage WHERE id = "${id}"`, (err, row) => {
        if (err) {
            clog(err, 'e')
            return
        } else {
            if (!row) {
                return true
            } else {
                return false
            }
        }
    })
}

class DBFileInteract {
    static async addFile(fileData) {
        return new Promise(async (resolve) => {
            const fileBuffer = Buffer.from(fileData.fileData, 'base64');

            let FID;
            do {
                FID = Math.floor(Math.random() * await get_id_limit().then(value => { return value }))
            } while (checkID(FID))

            db.run('INSERT INTO storage (id, file_name, mimetype, data, creation_date) VALUES (?, ?, ?, ?, ?)', [FID, fileData.fileName, fileData.fileMIMEType, fileBuffer, new Date().getTime()], (err) => {
                if (err) {
                    clog(err, 'e')
                    resolve('error')
                } else {
                    resolve(FID)
                }
            });
        })
    }

    static getFile(id) {
        return new Promise((resolve) => {
            db.get(`SELECT * FROM storage WHERE id = "${id}"`, (err, row) => {
                if (err) {
                    clog(err, 'e')
                    resolve({ result: 'error', message: `Помилка ${err}` })
                } else if (row) {
                    resolve({
                        id: row.id,
                        raw_data: row.data.toString('base64'),
                        file_name: row.file_name,
                        mime_type: row.mimetype,
                        creation_date: row.creation_date
                    })
                } else {
                    resolve('noFile')
                }
            })
        })
    }

    static rmFile(fileID) {
        return new Promise((resolve) => {
            db.run(`DELETE FROM storage WHERE id = "${fileID}"`, (err) => {
                if (err) {
                    clog(err, 'e')
                    resolve('error')
                } else {
                    resolve('succ')
                }
            })
        })

    }
}

module.exports = DBFileInteract