
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const view = (req) => {
    return new Promise((resolve) => {
        switch (req.type) {
            case 'view_id': {
                db.all(`SELECT * FROM items WHERE inv_number = ${req.arguments.id}`, (err, rows) => {
                    if (err) {
                        resolve({ result: 'error', message: 'Помилка запиту бази данних!' });
                    } else if (rows.length > 0) {
                        resolve({ result: 'success', data: rows });
                    } else {
                        resolve({ result: 'error', message: 'В базі даних немає таких даних!' });
                    }
                });
            }; break;
            case 'view_details': {
                db.all(`SELECT "meta" FROM items WHERE inv_number = ${req.arguments.id}`, (err, rows) => {
                    if (err) {
                        resolve({ result: 'error', message: 'Помилка запиту бази данних!' });
                    } else if (rows.length > 0) {
                        resolve({ result: 'success', data: rows });
                    } else {
                        resolve({ result: 'error', message: 'В базі даних немає таких даних!' });
                    }
                });
            }; break;
        }

    });
};

module.exports = view;