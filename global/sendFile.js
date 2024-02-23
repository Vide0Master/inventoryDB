async function uploadFile(file) {
    const base64File = await readFileAsBase64(file)
    const result = await request('/api/fileInteract', 'sendFile', {
        file: {
            file: base64File,
            fileName: file.name,
            fileType: file.type,
        }
    })
    console.log(result)
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