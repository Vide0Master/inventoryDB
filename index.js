const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

const fs = require('fs')
const clog = require('./modules/consoleLogger')
const flog = require('./modules/fileLogger')
const fsf = require('./modules/fileSizeFormat')
const sassMiddleware = require('node-sass-middleware');

app.get('/', (req, res) => {
    res.redirect('/auth')
})

app.use(express.json());
app.use(bodyParser.json());

const upload = multer({ charset: 'utf-8' });
const fileQueriesPath = "./file_queries";
fs.readdirSync(fileQueriesPath).forEach(file => {
    const filePath = path.join(fileQueriesPath, file);
    const queryModule = require('./' + filePath);
    // Добавляем функции из модуля в обработку запросов
    app.post(`/file/${path.parse(file).name}`, upload.array('files'), async (req, res) => {
        const files = req.files;
        const arguments = req.body;
        const result = await queryModule({ arguments, files });
        res.json(result);
    });
});

const queriesPath = "./queries";
fs.readdirSync(queriesPath).forEach(file => {
    const filePath = path.join(queriesPath, file);
    const queryModule = require('./' + filePath);
    // Добавляем функции из модуля в обработку запросов
    app.post(`/api/${path.parse(file).name}`, async (req, res) => {
        const arguments = req.body;
        const result = await queryModule(arguments);
        res.json(result);
    });
});

const pagesPath = path.join(__dirname, 'pages');
const globalFilesPath = path.join(__dirname, 'global');
// Создаем символические ссылки для глобальных файлов внутри папок с страницами
fs.readdirSync(pagesPath).forEach(page => {
    const pagePath = path.join(pagesPath, page);
    // Обработка статических файлов
    app.use(`/${page}`, express.static(pagePath));
    app.use(`/${page}`, express.static(globalFilesPath));
    app.use(`/${page}`, sassMiddleware({
        src: pagePath,
        debug: false,
        outputStyle: 'compressed',
        prefix: '/',
        response: true,
        force: true,
    }));
    app.use(`/${page}`, sassMiddleware({
        src: globalFilesPath,
        debug: false,
        outputStyle: 'compressed',
        prefix: '/',
        response: true,
        force: true,
    }));
    // Обработка запроса на страницу
    app.get(`/${page}`, async (req, res) => {
        const indexPath = path.join(pagePath, 'index.html');
        res.sendFile(indexPath);
    });
});

// Запуск сервера
app.listen(port, () => {
    clog(flog.createFile(), 'i')
    clog(`Сервер доступний по порту:${port}`, 's')
    clog(`Розмір бази данних складає: ${fsf(fs.statSync('./inventory.db').size)}`, 'i')
});