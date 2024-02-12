function fixCorruptedCyrillicString(corruptedString) {
    let buffer = Buffer.from(corruptedString, 'binary');
    return buffer.toString('utf-8');
}

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const upload = (req, res) => {
    try {
        const user = JSON.parse(req.body.user);
        const args = JSON.parse(req.body.arguments);
        const files = req.files;

        db.all('SELECT * FROM users WHERE login = ? AND private_key = ?', [user.login, user.key], (err, rows) => {
            if (err) {
                return res.status(500).json({ result: 'error', message: `Помилка бази даних:${err}` });
            }

            if (rows.length > 0 && rows[0].private_key !== '') {
                const promises = files.map(file => {
                    return new Promise((resolve, reject) => {
                        db.run('INSERT INTO storage (id, file_name, mimetype, data) VALUES (?, ?, ?, ?)', [Math.floor(Math.random() * 10000), fixCorruptedCyrillicString(file.originalname), file.mimetype, file.buffer], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        res.json({ result: 'succ' });
                    })
                    .catch(err => {
                        res.status(500).json({ result: 'error', message: `Помилка бази даних:${err}` });
                    });
            } else {
                res.status(500).json({ result: 'error', message: 'Помилка аутентифікації' });
            }
        });
    } catch (err) {
        res.status(500).json({ result: 'error', message: err });
    }
};

module.exports = upload;
