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

    if (timeout == 0) notification.innerHTML += `<button onclick="removeNotification(this.parentNode)">×</button>`

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    const existingNotifications = container.getElementsByClassName('notification');
    for (let i = 0; i < existingNotifications.length; i++) {
        existingNotifications[i].style.transform = `translateY(-${notification.offsetHeight}px)`;
    }

    setTimeout(() => {
        for (let i = 0; i < existingNotifications.length; i++) {
            existingNotifications[i].style.transform = 'translateY(0)';
        }
    }, 500);

    if (timeout > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, timeout);
    }
}

function removeNotification(notification) {
    const container = document.getElementById('notification-container');
    container.removeChild(notification);
}