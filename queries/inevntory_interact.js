const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');
const inv_interact = require('../modules/DBFileInteract')

const inv = (req) => {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM users WHERE login = "${req.user.login}" AND private_key = "${req.user.key}"`, async (err, row) => {
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
                        const item = req.arguments.item
                        const files = req.arguments.files

                        let f_info = {
                            docs: [],
                            photo: [],
                            info: {
                                AFID: []
                            }
                        }
                        for (const file of files) {
                            const FID = await inv_interact.addFile(file.file)
                            if (FID == 'error') return
                            const row = await new Promise((resolve) => {
                                db.get(`SELECT * FROM settings WHERE value = "${file.type}"`, async (err, row) => {
                                    console.log(row)
                                    if (err) {
                                        resolve({ result: 'error', message: `Помилка 1 додавння: ${err}` })
                                    } else {
                                        resolve(row)
                                    }
                                })
                            })
                            if (row.result == 'error') {
                                resolve(row)
                                return
                            }
                            db.run(`UPDATE storage SET type = '${file.type}' WHERE id = '${FID}'`)
                            switch (row.key) {
                                case 'STRG_DOCTYPE': {
                                    f_info.docs.push(FID)
                                }; break;
                                case 'STRG_IMGTYPE': {
                                    f_info.photo.push(FID)
                                }; break;
                                case 'STRG_OTHER':
                                default: {
                                    f_info.info.AFID.push(FID)
                                }; break;
                            }
                        }
                        console.log(f_info)
                        db.run(`INSERT INTO items(inv_number,item_name,item_type,cost,comment,status,meta_docs,meta_photo,meta_info) 
                        VALUES('${item.inv_number}','${item.item_name}','${item.item_type}','${item.cost}','${item.comment}','${item.status}','${JSON.stringify(f_info.docs)}','${JSON.stringify(f_info.photo)}','${JSON.stringify(f_info.info)}')`, (err) => {
                            if (err) {
                                resolve({ result: 'error', message: `Помилка 2 додавння: ${err}` })
                                return
                            } else {
                                resolve({ result: 'succ', message: `Успішно додано запис!` })
                            }
                        })
                    }
                }
            } else {
                resolve({ result: 'error', message: 'Помилка аутентифікації' });
            }
        })
    })
}

module.exports = inv