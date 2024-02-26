const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const inv = (req) => {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM users WHERE login = "${req.user.login}" AND private_key = "${req.user.key}"`, (err, row) => {
            if (err) {
                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
            } else if (row) {
                switch (req.type) {
                    case 'checkID': {
                        db.get(`SELECT * FROM items WHERE inv_number = "${req.arguments.id}"`, (err, row) => {
                            if (row) {
                                resolve({ result: true })
                            } else {
                                resolve({ result: false })
                            }
                            if (err) console.log(err)
                        })
                    }; break;
                    case 'createItem': {

                    }
                }
            } else {
                resolve({ result: 'error', message: 'Помилка аутентифікації' });
            }
        })
    })
}

module.exports = inv