const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

const download = (req, res) => {
    try {
        const fileId = JSON.parse(req.body.id); // Получаем идентификатор файла из аргументов запроса

        // Выбираем файл из базы данных по его идентификатору
        db.get('SELECT * FROM storage WHERE id = ?', [fileId], (err, row) => {
            if (err) {
                res.status(500).json({ result: 'error', message: `Помилка бази даних:${err}` });
            } else if (row) {
                // Отправляем файл на клиент
                const fileData = row.data; // BLOB-данные файла
                const fileName = row.file_name; // Имя файла
                const mimeType = row.mimetype; // MIME-тип файла

                // Отправляем данные на клиент

                res.status(200).json({
                    result: 'succ',
                    file: {
                        raw_data: fileData.toString('base64'),
                        file_name: fileName,
                        mime_type: mimeType
                    }
                });
            } else {
                res.status(404).json({ result: 'error', message: 'Файл не найден' });
            }
        });
    } catch (err) {
        res.status(500).json({ result: 'error', message: err });
    }
};

module.exports = download;
