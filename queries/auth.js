
const cLog = require('../modules/consoleLogger')
const SK=require('../modules/SKeyGen')

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const auth = (args) => {
    let { login, password } = args.arguments
    return new Promise((resolve) => {
        const query = `SELECT * FROM users WHERE login = ?`;
        db.all(query, [login], (err, rows) => {
            if (err) {
                cLog(`Спроба авторизації користувача ${login} невдала та викликала помилку SQL запиту!\n${err}`,"e")
                resolve({ result: 'error', message: 'Помилка запиту бази данних!' });
            } else if (rows.length > 0) {
                const user = rows[0];
                if (password === user.password) {
                    cLog(`Користувач ${user.login}(${user.name} ${user.surname}) авторизований в системі!`,"s")
                    const key=SK()
                    db.run('UPDATE users SET private_key = ? WHERE login = ?',[key,login],function(err){
                        if(err){
                            cLog(`Спроба авторизації користувача ${login} вдала, але викликала помилку SQL запиту!\n${err}`,"e")
                            resolve({ result: 'error', message: 'Помилка запиту бази данних!' });

                        }
                    })
                    resolve({ result: 'success', data: {name:user.name,surname:user.surname,PK:key,LP:user.last_page,permission_level:user.permission_level } });
                } else {
                    cLog(`Користувач ${user.login}(${user.name} ${user.surname}) спробував авторизуватись, але ввів неправильний пароль!`,"i")
                    resolve({ result: 'error', message: 'Невірні дані авторизації!' });
                }
            } else {
                cLog(`Спроба авторизації користувача ${login} невдала, бо такого користувача не існує`,"i")
                resolve({ result: 'error', message: 'Невірні дані авторизації!' });
            }
        });
    });
};

module.exports = auth;
