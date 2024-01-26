
const cLog = require('../modules/consoleLogger')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');
const pages = require('../modules/page_list.json')

const check_key = (args) => {
    let { login, key } = args.arguments
    return new Promise((resolve) => {
        if (args.arguments.LP != '/auth/') {
            db.run(`UPDATE users SET "last_page" = "${args.arguments.LP}" WHERE "login" = "${login}"`, (err) => { if (err) { cLog(err, 'e') } })
        }
        const query = `SELECT * FROM users WHERE login = ?`;
        db.all(query, [login], (err, rows) => {
            if (err) {
                resolve({ result: 'error', message: 'Помилка запиту бази данних!' });
            } else if (rows.length > 0) {
                const user = rows[0];
                pages.forEach(val=>{
                    if(args.arguments.LP.slice(1, -1)==val.link&&user.permission_level<val.AL){
                        resolve({ result: 'error', message: 'Невірні дані авторизації!' });
                    }
                })
                if (key === user.private_key) {
                    resolve({ result: 'success', LP: user.last_page });
                } else {
                    resolve({ result: 'error', message: 'Невірні дані авторизації!' });
                }
            } else {
                resolve({ result: 'error', message: 'Невірні дані авторизації!' });
            }
        });
    });
};

module.exports = check_key;
