function uploadFile(fileInput, args) {
    var files = fileInput.files;
    if (files.length === 0) {
        alert('Файл(и) для загрузки не выбрані!', 5000, 'error')
        return "err";
    }

    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    let usr = JSON.parse(sessionStorage.getItem('account'))
    if (usr == null) usr = { login: 'def', key: 'def' }
    const additionalData = {
        arguments: args,
        user: { login: usr.login, key: usr.skey }
    }

    for (var key in additionalData) {
        if (additionalData.hasOwnProperty(key)) {
            formData.append(key, JSON.stringify(additionalData[key]));
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/file/upload', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Вывод JSON-ответа в консоль
                console.log(JSON.parse(xhr.responseText));
            } else {
                // Обработка ошибочного ответа
                alert('Помилка завантаження!', 5000, 'err')
            }
        }
    };

    xhr.send(formData);

    return xhr.upload;
}
