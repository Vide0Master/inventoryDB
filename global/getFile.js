function downloadFile(id, type) {
    let xhr = new XMLHttpRequest();
    var formData = new FormData();
    let usr = JSON.parse(sessionStorage.getItem('account'))
    if (usr == null) usr = { login: 'def', key: 'def' }
    const additionalData = {
        id: id,
        user: { login: usr.login, key: usr.skey }
    }

    for (var key in additionalData) {
        if (additionalData.hasOwnProperty(key)) {
            formData.append(key, JSON.stringify(additionalData[key]));
        }
    }

    xhr.open('POST', `/file/download`, true);
    xhr.responseType = 'blob'; // Устанавливаем тип ответа как blob

    xhr.onreadystatechange = function () {
        console.log(xhr)
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let contentType = xhr.getResponseHeader('Content-Type');
                let disposition = xhr.getResponseHeader('Content-Disposition');
                let fileName = '';

                // Получаем имя файла из заголовка Content-Disposition, если он присутствует
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    let fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    let matches = fileNameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        fileName = matches[1].replace(/['"]/g, '');
                    }
                }

                if (type === 'file') {
                    // Если тип действия "file", создаем ссылку для скачивания
                    let blob = new Blob([xhr.response], { type: contentType });
                    let url = window.URL.createObjectURL(blob);

                    // Создаем ссылку и автоматически загружаем файл при клике
                    let link = document.createElement('a');
                    link.href = url;
                    link.download = fileName || 'file'; // Имя файла или "file", если имя не получено
                    document.body.appendChild(link);
                    link.click();

                    // Удаляем ссылку после загрузки файла
                    setTimeout(function () {
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(link);
                    }, 0);
                } else if (type === 'data') {
                    // Если тип действия "data", возвращаем данные файла
                    let blob = new Blob([xhr.response], { type: contentType });
                    let url = window.URL.createObjectURL(blob);
                    console.log(url); // Выводим данные файла в консоль
                } else {
                    console.error('Invalid action type');
                }
            } else {
                console.error('Failed to download file');
            }
        }
    };

    xhr.send(formData);
}