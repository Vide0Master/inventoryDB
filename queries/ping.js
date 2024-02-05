const ping = (req) => {
    return new Promise((resolve) => {
        resolve({ result: 'succ'});
    });
};

module.exports = ping;
