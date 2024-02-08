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

                // Устанавливаем соответствующие заголовки ответа
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

                // Отправляем BLOB-данные на клиент
                res.status(200).end(fileData, 'binary');
            } else {
                res.status(404).json({ result: 'error', message: 'Файл не найден' });
            }
        });
    } catch (err) {
        res.status(500).json({ result: 'error', message: err });
    }
};

module.exports = download;
