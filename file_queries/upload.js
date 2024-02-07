function fixCorruptedCyrillicString(corruptedString) {
    var buffer = Buffer.from(corruptedString, 'binary');
    return buffer.toString('utf-8');
}

const upload = (data) => {
    args = data.arguments
    files = data.files
    return new Promise((resolve) => {

        try {
            console.log(args)
            files.forEach(file => {
                console.log(fixCorruptedCyrillicString(file.originalname))
            });
            resolve({ result: 'succ' });
        } catch (err) {
            resolve({ result: 'err', message: err });
        }
    });
};

module.exports = upload;
