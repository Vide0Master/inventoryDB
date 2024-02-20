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

    fileInput.addEventListener('change', renderFileList);

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function renderFileList() {
        fileList.innerHTML = '';
        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileBlock = document.createElement('div')
            fileBlock.className = 'file-item'
            let fbbcStyle=''
            switch(getFileExtension(file.name)){
                case'doc':{fbbcStyle='#6279fc'};break;
                case'docx':{fbbcStyle='#2142ff'};break;
                case'txt':{fbbcStyle='#ababab'};break;
            }
            if(file.type.startsWith('image/')) fbbcStyle='#fcb542'
            fileBlock.style.borderColor=fbbcStyle
            const fileItem = document.createElement('div');
            fileItem.className = 'file-name'
            fileItem.innerText = file.name

            const rm_button = document.createElement('button')
            rm_button.className = 'file-remove'
            rm_button.innerText = 'Видалити'
            rm_button.addEventListener('click', (e) => {
                removeFile(file.name, e)
            })
            
            fileBlock.appendChild(fileItem)
            fileBlock.appendChild(rm_button)
            fileList.appendChild(fileBlock)
        }
    }

    function removeFile(fn, event) {
        let dataTransfer = new DataTransfer();
        for(const file of fileInput.files){
            if (file.name !== fn) {
                dataTransfer.items.add(file);
            }
            if(file.name == fn) console.log(file)
        }
        fileInput.files = dataTransfer.files;
        event.target.parentNode.classList.add('rm-animation')
        event.target.parentNode.addEventListener('animationend',()=>{
            event.target.parentNode.remove()
        })
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
            alert(uploadResult.message, 2000, uploadResult.result)
        }
    });
}

head_require([
    { type: 'style', link: 'parts/upload_zone/upload_zone.css' }
])