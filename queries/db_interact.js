
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const data_limits = {
    inv_number: 10,
    item_name: 300,
    item_type: 50,
    comment: 200,
    cabinet: 100,
    workplace: 100,
    user: 80,
    creation_timestamp: 0,
    edit_timestamp: 0
}
const data_elements = {
    inv_number: 'Інвентарний номер',
    item_name: 'Назва',
    item_type: 'Тип',
    cost: 'Вартість',
    comment: 'Комментарій',
    cabinet: 'Кабінет',
    workplace: 'Робоче місце',
    user: 'Користувач'
}

let reboot = false;

const db_interact = (req) => {
    return new Promise((resolve) => {
        db.all('SELECT * FROM users WHERE login = ? AND private_key = ?', [req.user.login, req.user.key], (err, rows) => {
            if (err) {
                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
            } else if (rows.length > 0 && rows[0].private_key != '') {
                const user_acc = rows[0]
                let query = "", values = ""
                switch (req.type) {
                    case 'get_user': {
                        query = `SELECT * FROM users WHERE login = ? AND private_key = ?`
                        values = [req.arguments.login, req.arguments.key]
                        db.all(query, values, (err, rows) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else if (rows.length > 0) {
                                resolve({ result: 'success', data: rows });
                            } else {
                                resolve({ result: 'error', message: 'Немає данних!' });
                            }
                        });
                    }; break;
                    case 'get_item': {
                        query = `SELECT * FROM items WHERE "${req.arguments.col}" LIKE "${req.arguments.value}"`
                        db.all(query, (err, rows) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else if (rows.length > 0) {
                                resolve({ result: 'success', data: rows });
                            } else {
                                resolve({ result: 'error', message: `Відсутні дані по запиту: [${data_elements[req.arguments.col]}] ~ [${req.arguments.value}]` });
                            }
                        });
                    }; break;
                    case 'get_all_items': {
                        query = `SELECT * FROM items`
                        values = []
                        db.all(query, values, (err, rows) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else if (rows.length > 0) {
                                resolve({ result: 'success', data: rows });
                            } else {
                                resolve({ result: 'error', message: 'Відсутні дані по запиту' });
                            }
                        });
                    }; break;
                    case 'set_item': {
                        const insrt = [req.arguments.inv_number, req.arguments.item_name, req.arguments.item_type, Number(req.arguments.cost), req.arguments.comment, req.arguments.cabinet, req.arguments.workplace, req.arguments.user, req.arguments.creation_timestamp, req.arguments.edit_timestamp]
                        for (const key in data_limits) {
                            if ((String(req.arguments[key]).length > data_limits[key]) && (!key.endsWith('timestamp'))) {
                                resolve({ result: 'error', message: `Перевищення ліміту розміру поля "${data_elements[key]}" на ${String(req.arguments[key]).length - data_limits[key]} символів` });
                                return
                            }
                        }
                        db.run(`INSERT INTO items (inv_number, item_name, item_type, cost, comment, cabinet, workplace, user, creation_timestamp, edit_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, insrt, (err) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else {
                                resolve({ result: 'succ', message: 'Успішне створення' });
                            }
                        });
                    }; break;
                    case 'update_item': {
                        const upd = [req.arguments.item_name, req.arguments.item_type, Number(req.arguments.cost), req.arguments.comment, req.arguments.edit_timestamp, req.arguments.inv_number]
                        for (const key in data_limits) {
                            if ((String(req.arguments[key]).length > data_limits[key]) && (!key.endsWith('timestamp'))) {
                                resolve({ result: 'error', message: `Перевищення ліміту розміру поля "${data_elements[key]}" на ${String(req.arguments[key]).length - data_limits[key]} символів` });
                                return
                            }
                        }
                        db.run(`UPDATE items SET item_name = ?, item_type = ?, cost = ?, comment = ?, edit_timestamp = ? WHERE inv_number = ?`, upd, (err) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else {
                                resolve({ result: 'succ', message: 'Успішне оновлення' });
                            }
                        })
                    }; break;
                    case 'move_item': {
                        const upd = [req.arguments.cabinet, req.arguments.workplace, req.arguments.user, req.arguments.edit_timestamp, req.arguments.inv_number]
                        for (const key in data_limits) {
                            if ((String(req.arguments[key]).length > data_limits[key]) && (!key.endsWith('timestamp'))) {
                                resolve({ result: 'error', message: `Перевищення ліміту розміру поля "${data_elements[key]}" на ${String(req.arguments[key]).length - data_limits[key]} символів` });
                                return
                            }
                        }
                        db.run(`UPDATE items SET cabinet = ?, workplace = ?, user = ?, edit_timestamp = ? WHERE inv_number = ?`, upd, (err) => {
                            if (err) console.error(err)
                        })
                        const insrt = [req.arguments.inv_number, JSON.stringify(req.arguments.from), JSON.stringify(req.arguments.to), Math.floor(new Date() / 1000)]
                        db.run(`INSERT INTO relocations ("inv_number", "from", "to", "date") VALUES (?, ?, ?, ?)`, insrt, (err) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else {
                                resolve({ result: 'succ', message: 'Успішне переміщення' });
                            }
                        });
                    }
                    case 'get_all_relocations': {
                        query = `SELECT * FROM "relocations"`
                        db.all(query, (err, rows) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else if (rows.length > 0) {
                                resolve({ result: 'success', data: rows });
                            } else {
                                resolve({ result: 'error', message: 'Відсутні дані по запиту' });
                            }
                        });
                    }; break;
                    case 'get_item_types': {
                        db.all(`SELECT * FROM "inv_item_types"`, (err, rows) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка бази даних:${err}` });
                            } else if (rows.length > 0) {
                                let types = [];
                                rows.forEach(type => types.push(type.type))
                                resolve({ result: 'success', data: types });
                            } else {
                                resolve({ result: 'error', message: 'Відсутні дані по запиту' });
                            }
                        })
                    }; break;
                    case 'edit_item_types': {
                        switch (req.arguments.type) {
                            case 'add': {
                                if (String(req.arguments.name).length > data_limits.item_type) {
                                    resolve({ result: 'success', data: { message: `Перевищення ліміту довжини назви типу на ${String(req.arguments.name).length - data_limits.item_type}`, msg_type: 'error' } });
                                    return
                                } else {
                                    db.run(`INSERT INTO inv_item_types (type) VALUES ("${req.arguments.name}")`, (err) => {
                                        if (err) {
                                            resolve({ result: 'success', data: { message: `Помилка [${err}] при додаванні типу "${req.arguments.name}"`, msg_type: 'error' } });
                                        } else {
                                            resolve({ result: 'success', data: { message: `Успішне додавання типу "${req.arguments.name}"`, msg_type: 'succ' } });
                                        }
                                    })
                                }
                            }; break;
                            case 'remove': {
                                db.run(`DELETE FROM inv_item_types WHERE type = "${req.arguments.name}"`, (err) => {
                                    if (err) {
                                        resolve({ result: 'success', data: { message: `Помилка [${err}] при видаленні типу "${req.arguments.name}"`, msg_type: 'error' } });
                                    } else {
                                        resolve({ result: 'success', data: { message: `Успішне видалення типу "${req.arguments.name}"`, msg_type: 'succ' } });
                                    }
                                })
                            }; break;
                        }
                    }; break;
                    case 'reboot_n_update': {
                        if (req.arguments.rq_type == 'shutdown') {
                            if (req.arguments.pass == 'inv_reb00t') {
                                resolve({ result: "warn", message: `Команда перезавантаження отримана` })
                                setTimeout(() => {
                                    process.exit()
                                }, 10);
                            } else {
                                resolve({ result: "error", message: 'Вказано невірний пароль!' })
                            }
                        } else {
                            resolve({ result: "succ", message: 'Перезавантаження завершене!' })
                        }
                    }; break;
                    case 'get_all_users': {
                        if (user_acc.permission_level == 3) {
                            db.all(`SELECT * FROM "users"`, (err, rows) => {
                                if (err) {
                                    console.log(err)
                                    resolve({ result: 'error', message: 'Помилка запиту бази данних!' })
                                } else {
                                    resolve({ result: 'succ', data: rows })
                                }
                            })
                        } else {
                            resolve({ result: 'error', message: 'Недостатній рівень!' })
                        }
                    }; break;
                    case 'update_user_parameter': {
                        if (user_acc.permission_level >= 3) {
                            db.run(`UPDATE users SET "${req.arguments.ftype}" = "${req.arguments.value}" WHERE login = "${req.arguments.user}"`, (err) => {
                                if (err) {
                                    resolve({ result: 'error', message: `Помилка зміни значення!` });
                                } else {
                                    resolve({ result: 'succ', message: `Значення ${req.arguments.ftype} успішно змінене для користувача ${req.arguments.user}` });
                                }
                            })
                        }
                    }; break;
                    default: { resolve({ result: "error", message: `Невдала обробка запиту "${req.type}"` }) }
                }
            } else {
                resolve({ result: 'error', message: 'Помилка аутентифікації' });
            }
        })

    })
};

module.exports = db_interact;
