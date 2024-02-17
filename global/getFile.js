async function downloadFile(id, type) {
    try {
        if(id==''){
            alert('Id не введене',2000,'error')
            return
        }
        let usr = JSON.parse(sessionStorage.getItem('account'))
        if (usr == null) usr = { login: 'def', key: 'def' }
        const response = await fetch('/file/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                user: { login: usr.login, key: usr.skey }
            }),
        });
        if (!response.ok) {
            alert(errorData.message, 5000, errorData.result);
            return 'nsr'
        }
        const responseData = await response.json();
        console.log(responseData)
        if (responseData.result === 'succ') {
            const fileData = responseData.file.raw_data;
            const fileName = responseData.file.file_name;
            const mimeType = responseData.file.mime_type;

            const blob = b64toBlob(fileData, mimeType);
            const url = window.URL.createObjectURL(blob);
            console.log(url)
            if (type === 'file') {
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName || 'file';
                document.body.appendChild(link);
                link.click();
                setTimeout(function () {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                }, 0);
            } else if (type === 'data') {
                return url;
            } else {
                throw new Error('Invalid action type');
            }
        } else {
            throw new Error('Failed to download file');
        }
    } catch (error) {
        console.error('Failed to download file:', error);
        throw error;
    }
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
