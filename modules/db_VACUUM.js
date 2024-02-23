const fsf = require('../modules/fileSizeFormat')
const clog = require('../modules/consoleLogger')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');
clog(`Початок оптимізації бази данних...`, 'w')
const db_size_before = fs.statSync('./inventory.db').size
new Promise((resolve) => {
    db.serialize(() => {
        db.run('VACUUM', (err) => {
            if (err) {
                clog(`Помилка при оптимізації бази даних:${err.message}`, 'e');
                resolve()
            } else {
                clog('Оптимізація бази даних успішно завершена!', 's');
                resolve()
            }
        });
    });
}).then(() => {
    const db_size_after = fs.statSync('./inventory.db').size
    clog(`Зміна розміру бази данних склала ${fsf(db_size_before - db_size_after)} [${fsf(db_size_before)}->${fsf(db_size_after)}]`, 'i')
})