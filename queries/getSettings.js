const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const getSettings = (req) => {
    return new Promise((resolve) => {
        const user = req.user
        db.get(`SELECT * FROM users WHERE login = "${user.login}" AND private_key = "${user.key}"`, (err, row) => {
            if (err) {
                resolve({ result: 'error', message: `Помилка бази даних` });
            } else if(row) {
                db.all(`SELECT value FROM settings WHERE key = "${req.type}"`,(err, rows)=>{
                    if(err){
                        resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                    }else{
                        resolve({ result: 'succ', data:rows });
                    }
                })
            }else{
                resolve({ result: 'error', message: `Деавторизовано` });
            }
        })
    })
}

module.exports = getSettings