const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const upload = async (req, res) => {
    try {
        const { file, fileName, fileType, args, user } = req.body;

        // Проверка аутентификации пользователя
        db.all('SELECT * FROM users WHERE login = ? AND private_key = ?', [user.login, user.key], (err, rows) => {
            if (err) {
                return res.status(500).json({ result: 'error', message: `Помилка бази даних:${err}` });
            }

            if (rows.length > 0 && rows[0].private_key !== '') {
                // Преобразование файла из base64 в формат BLOB
                const fileBuffer = Buffer.from(file, 'base64');

                // Продолжаем обработку файла и сохранение в базу данных
                const FID = Math.floor(Math.random() * 10000)
                db.run('INSERT INTO storage (id, file_name, mimetype, data) VALUES (?, ?, ?, ?)', [FID, fileName, fileType, fileBuffer], (err) => {
                    if (err) {
                        return res.status(500).json({ result: 'error', message: `Помилка бази даних:${err}` });
                    }
                    res.json({ result: 'succ', message:`Файл [${fileName}] Завантажено під ID#${FID}` });
                });
            } else {
                res.status(401).json({ result: 'error', message: 'Помилка аутентифікації' });
            }
        });

    } catch (err) {
        res.status(500).json({ result: 'error', message: err });
    }
};

module.exports = upload;
