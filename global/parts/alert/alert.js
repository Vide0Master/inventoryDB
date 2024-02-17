head_require([{ type: 'style', link: 'parts/alert/alert.css' }])

const bd = document.querySelector("body")
const notf_cont = document.createElement('div')
bd.appendChild(notf_cont)
notf_cont.id = 'notification-container'
notf_cont.className = 'notification-container'
window.alert = function (message, timeout, type) {
    createNotification(message, timeout, type);
};

function createNotification(message, timeout = 0, type = "") {
    const container = document.getElementById('notification-container');

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;

    container.insertBefore(notification, container.firstChild);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    if (timeout > 0) {
        var timer = setTimeout(() => {
            removeNotification(notification);
        }, timeout);
    }

    notification.addEventListener('click', () => {
        clearTimeout(timer)
        removeNotification(notification)
    })
}

function removeNotification(notification) {
    notification.classList.add('removing-element')
    setTimeout(() => {
        const container = document.getElementById('notification-container');
        container.removeChild(notification);
    }, 700);
}