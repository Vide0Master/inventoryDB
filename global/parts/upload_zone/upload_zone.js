function createFileUploadContainer(parentElement) {
    const fileUploadContainer = document.createElement('div');
    fileUploadContainer.id = 'file-upload-container';
    parentElement.appendChild(fileUploadContainer);

    const buttonsRow = document.createElement('div')
    fileUploadContainer.appendChild(buttonsRow)
    buttonsRow.className = 'buttons-row'

    const fileInput = document.createElement('input');
    buttonsRow.appendChild(fileInput)
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.hidden = true

    const selectBtn = document.createElement('button')
    buttonsRow.appendChild(selectBtn)
    selectBtn.id = 'upload-btn'
    selectBtn.innerText = 'Обрати файли'
    selectBtn.addEventListener('click', () => fileInput.click())

    const clearBtn = document.createElement('button')
    buttonsRow.appendChild(clearBtn)
    clearBtn.id = 'upload-btn'
    clearBtn.innerText = 'Очистити'
    clearBtn.addEventListener('click', () => clearFiles())

    const fileList = document.createElement('div');
    fileUploadContainer.appendChild(fileList)
    fileList.id = 'file-list'

    const uploadBtn = document.createElement('button')
    buttonsRow.appendChild(uploadBtn)
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
            let fbbcStyle = ''
            switch (getFileExtension(file.name)) {
                case 'doc': { fbbcStyle = '#6279fc' }; break;
                case 'docx': { fbbcStyle = '#2142ff' }; break;
                case 'txt': { fbbcStyle = '#ababab' }; break;
            }
            if (file.type.startsWith('image/')) fbbcStyle = '#fcb542'
            fileBlock.style.borderColor = fbbcStyle
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

    function clearFiles() {
        const buttons = document.querySelectorAll('.file-item .file-remove')
        if(buttons.length==0){
            alert("Список файлів пустий",3000,'warn')
        }

        let i = buttons.length - 1;
        function clickButton() {
          if (i >= 0) {
            buttons[i].click();
            i--;
            setTimeout(clickButton, 50);
          }
        }
        clickButton();
    }

    function removeFile(fn, event) {
        let dataTransfer = new DataTransfer();
        for (const file of fileInput.files) {
            if (file.name !== fn) {
                dataTransfer.items.add(file);
            }
        }
        fileInput.files = dataTransfer.files;
        event.target.parentNode.classList.add('rm-animation')
        event.target.parentNode.addEventListener('animationend', () => {
            event.target.parentNode.remove()
        })
    }

    uploadBtn.addEventListener('click', async () => {
        const files = fileInput.files;
        if (files.length == 0) {
            alert('Файл(и) для завантаження не вибрані!', 5000, 'error')
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