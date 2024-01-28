const express = require('express');
const path = require('path');

const app = express();
const port = 3000;


const fs = require('fs')
const clog = require('./modules/consoleLogger')
const flog = require('./modules/fileLogger')
const fsf = require('./modules/fileSizeFormat')
const sassMiddleware = require('node-sass-middleware');

// Middleware для обработки JSON в запросах
app.use(express.json());

// Подгрузка всех файлов в папке queries
const queriesPath = "./queries"
fs.readdirSync(queriesPath).forEach(file => {
    const filePath = path.join(queriesPath, file);
    const queryModule = require("./" + filePath);
    // Добавляем функции из модуля в обработку запросов
    app.post(`/api/${queryModule.name}`, async (req, res) => {
        const arguments = req.body;
        const result = await queryModule(arguments);
        res.json(result);
    });
});

app.get('/', (req, res) => {
    res.redirect('/auth')
})

// Настроим middleware для обработки статических файлов из папки 'auth'
const pagesPath = path.join(__dirname, 'pages');
const globalFilesPath = path.join(__dirname, 'global');

// Middleware для компиляции Sass/SCSS
app.use(sassMiddleware({
    src: pagesPath, // Путь к исходным файлам Sass/SCSS (включая подпапки)
    dest: path.join(__dirname, 'public'), // Путь для скомпилированных CSS файлов
    debug: false,
    outputStyle: 'compressed', // Минимизировать CSS
    prefix: '/', // Префикс для URL, по которому будут доступны стили
    response: true, // Добавьте эту опцию
    force: true, // Добавьте эту опцию
}));

// Создаем символические ссылки для глобальных файлов внутри папок с страницами
fs.readdirSync(pagesPath).forEach(page => {
    const pagePath = path.join(pagesPath, page);

    // Обработка статических файлов
    app.use(`/${page}`, express.static(pagePath));
    app.use(`/${page}`, express.static(globalFilesPath));
    // Обработка запроса на страницу
    app.get(`/${page}`, async (req, res) => {
        const indexPath = path.join(pagePath, 'index.html');
        res.sendFile(indexPath);
    });
});

// Запуск сервера
app.listen(port, () => {
    flog.createFile()
    clog(flog.get_log_info(), 'i')
    clog(`Сервер доступний по порту:${port}`, 's')
    clog(`Розмір бази данних складає: ${fsf(fs.statSync('./inventory.db').size)}`, 'i')
});