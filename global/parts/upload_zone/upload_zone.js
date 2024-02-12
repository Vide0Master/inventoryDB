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
            const fileItem = document.createElement('div');
            const rm_button = document.createElement('button')
            rm_button.innerText = 'видалити'
            rm_button.addEventListener('click', () => {
                removeFile(i)
            })
            fileItem.className = 'file-item';
            fileItem.innerText = file.name
            fileItem.appendChild(rm_button)
            fileList.appendChild(fileItem);
        }
    }

    function removeFile(index) {
        console.log(fileInput.files)
        let dataTransfer = new DataTransfer();

        for (let i = 0; i < fileInput.files.length; i++) {
            if (i !== index) {
                dataTransfer.items.add(fileInput.files[i]);
            }
        }
    
        fileInput.files = dataTransfer.files;
        updateFileList();
    }

    uploadBtn.addEventListener('click', () => {
        const files = fileInput.files;
        const uploadResult = uploadFile(fileInput, {});
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            fileList.childNodes[i].appendChild(progressBar);
            uploadResult.addEventListener('progress', function (event) {
                const percent = (event.loaded / event.total) * 100;
                progressBar.style.width = percent + '%';
            });
        }
    });
}

head_require([
    { type: 'style', link: 'parts/upload_zone/upload_zone.css' }
])