let sizes = ['Б', 'КБ', 'МБ', 'ГБ']

module.exports = function (fileSizeInBytes) {
    let size = fileSizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < sizes.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)}${sizes[unitIndex]}`;
}