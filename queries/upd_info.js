
const updates = require('../modules/update_info.json')

const upd_info = (req) => {
    return new Promise((resolve) => {
        switch (req.type) {
            case 'all_updates': {
                try {
                    resolve({ result: 'success', data: updates });
                } catch (err) {
                    resolve({ result: 'error', message: err });
                }
            }; break;
            case 'latest_ver': {
                try {
                    resolve({ result: 'success', data: updates[0] });
                } catch (err) {
                    resolve({ result: 'error', message: err });
                }
            }; break;
        }
    });
};

module.exports = upd_info;
