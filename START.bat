@ECHO off
chcp 65001

ECHO Перевірка оновлення...
git pull

ECHO запуск серверу...
node index.js

pause