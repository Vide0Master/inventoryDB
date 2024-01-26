@ECHO off
chcp 65001

:reset_point

ECHO Перевірка оновлення...
git pull

ECHO Запуск серверу...
node index.js

goto :reset_point