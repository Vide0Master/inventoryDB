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

        const fileBuffer = Buffer.from(fileData.file, 'base64');

        let FID;
        do {
            FID = Math.floor(Math.random() * await get_id_limit().then(value => { return value }))
        } while (checkID(FID))

        db.get('INSERT INTO storage (id, file_name, mimetype, data) VALUES (?, ?, ?, ?)', [FID, fileData.fileName, fileData.fileType, fileBuffer], (err) => {
            if (err) {
                clog(err, 'e')
                return 'err'
            } else {
                return FID
            }
        });
    }
    static getFile(id) {
        db.get(`SELECT * FROM storage WHERE id = "${id}"`, (err, row) => {
            if (err) {
                clog(err, 'e')
                return
            } else if (row) {
                return {
                    id: row.id,
                    raw_data: row.data.toString('base64'),
                    file_name: row.file_name,
                    mime_type: row.mimetype
                }
            } else {
                return 'noFile'
            }
        })
    }
    static rmFile(fileID) {
        db.run(`DELETE FROM storage WHERE id = "${fileID}"`, (err) => {
            if (err) {
                clog(err, 'e')
                return 'err'
            } else {
                return 'succ'
            }
        })
    }
}

module.exports = DBFileInteract