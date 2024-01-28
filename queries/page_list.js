
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');
const pages = require('../modules/page_list.json')

const page_list = (req) => {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM users WHERE login = "${req.user.login}"`, (err, rows) => {
            if (err) {
                console.log(err)
                resolve({ result: 'error', message: err });
            } else {
                try {
                    let pages_for_user = []
                    pages.forEach((page) => {
                        if (page.AL <= rows.permission_level) pages_for_user.push(page)
                    })
                    resolve({ result: 'success', data: pages_for_user });
                }catch(err){
                    resolve({ result: 'error', message: err });
                }
            }
        })
    });
};

module.exports = page_list;
