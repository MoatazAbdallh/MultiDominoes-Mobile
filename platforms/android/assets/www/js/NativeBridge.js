var NativeBridge = {
    openUrl: function (url, target, options) {
        window.open(url, target, options);
    },
    alert: function(message, alertCallback, title, buttons){
        if (navigator.notification) {
            navigator.notification.alert(message, alertCallback, title, buttons)
        }
        else
            alert(message);
    },
    toastshort: function (message) {
        if (window.plugins && window.plugins.toast)
            window.plugins.toast.showShortBottom(message);
        else
            NativeBridge.alert(message);
    },
    closeApp: function () {
        if (navigator.app)
            navigator.app.exit();
        else
            window.close();
    }
}