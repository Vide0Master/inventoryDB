async function uploadFile(file, arguments) {
    try {
        let usr = JSON.parse(sessionStorage.getItem('account'))
        if (usr == null) usr = { login: 'def', key: 'def' }

        // Преобразование файла в строку base64
        const base64File = await readFileAsBase64(file)
        const response = await fetch('/file/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                file: base64File,
                fileName: file.name, // Передача имени файла
                fileType: file.type, // Передача MIME-типа файла
                args: arguments,
                user: { login: usr.login, key: usr.skey }
            }),
        });

        if (!response.ok) {
            return 'nsr'
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Сталась помилка обробки запиту:', error);
        return 'nsr'
    }
}

async function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}