function downloadFile(id, type) {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let usr = JSON.parse(sessionStorage.getItem('account'))
    if (usr == null) usr = { login: 'def', key: 'def' }
    const additionalData = {
        id: id,
        user: { login: usr.login, key: usr.skey }
    }

    for (const key in additionalData) {
        if (additionalData.hasOwnProperty(key)) {
            formData.append(key, JSON.stringify(additionalData[key]));
        }
    }

    xhr.open('POST', `/file/download`, true);
    xhr.responseType = 'json'; // Устанавливаем тип ответа как JSON

    xhr.onreadystatechange = function () {
        console.log(xhr)
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const responseData = xhr.response;
                if (responseData.result === 'succ') {
                    const fileData = responseData.file.raw_data;
                    const fileName = responseData.file.file_name;
                    const mimeType = responseData.file.mime_type;

                    if (type === 'file') {
                        // Если тип действия "file", создаем ссылку для скачивания
                        const blob = b64toBlob(fileData, mimeType);
                        const url = window.URL.createObjectURL(blob);
                        // Создаем ссылку и автоматически загружаем файл при клике
                        const link = document.createElement('a');
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
                        console.log(blob); // Выводим данные файла в консоль
                    } else {
                        console.error('Invalid action type');
                    }
                } else {
                    console.error('Failed to download file');
                }
            }
        }
    };

    xhr.send(formData);
}

// Функция для конвертации base64 строки в Blob объект с указанием MIME-типа
function b64toBlob(b64Data, contentType = '') {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
