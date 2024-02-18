function createFileUploadContainer(parentElement) {
    const fileUploadContainer = document.createElement('div');
    fileUploadContainer.id = 'file-upload-container';
    parentElement.appendChild(fileUploadContainer);

    const fileInput = document.createElement('input');
    fileUploadContainer.appendChild(fileInput)
    fileInput.type = 'file'
    fileInput.id = 'file-input'
    fileInput.multiple = true

    const fileList = document.createElement('div');
    fileUploadContainer.appendChild(fileList)
    fileList.id = 'file-list'

    const uploadBtn = document.createElement('button')
    fileUploadContainer.appendChild(uploadBtn)
    uploadBtn.id = 'upload-btn'
    uploadBtn.innerText = 'Завантажити'

    fileInput.addEventListener('change', updateFileList);

    function updateFileList() {
        fileList.innerHTML = '';
        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileBlock = document.createElement('div')
            const fileItem = document.createElement('div');
            const rm_button = document.createElement('button')
            rm_button.innerText = 'Видалити'
            rm_button.addEventListener('click', () => {
                removeFile(i)
            })
            fileItem.className = 'file-item'
            fileItem.innerText = file.name
            fileBlock.appendChild(fileItem)
            fileBlock.appendChild(rm_button)
            fileList.appendChild(fileBlock)
        }
    }

    function removeFile(index) {
        let dataTransfer = new DataTransfer();

        for (let i = 0; i < fileInput.files.length; i++) {
            if (i !== index) {
                dataTransfer.items.add(fileInput.files[i]);
            }
        }

        fileInput.files = dataTransfer.files;
        updateFileList();
    }

    uploadBtn.addEventListener('click', async () => {
        const files = fileInput.files;
        if (files.length == 0) {
            alert('Файл(и) для загрузки не выбрані!', 5000, 'error')
            return
        }
        for (const file of files) {
            const uploadResult = await uploadFile(file, {});
            console.log(uploadResult)
            alert(uploadResult.message,2000,uploadResult.result)
        }
    });
}

head_require([
    { type: 'style', link: 'parts/upload_zone/upload_zone.css' }
])