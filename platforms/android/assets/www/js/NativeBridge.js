var NativeBridge = {
    openUrl: function (url, target, options) {
        window.open(url, target, options);
    },
    alert: function (message, alertCallback, title, buttons) {
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
    toastlong: function (message) {
        if (window.plugins && window.plugins.toast)
            window.plugins.toast.showLongBottom(message);
        else
            NativeBridge.alert(message);
    },
    deviceId: function () {
        if (window.device)
            return device.uuid;
        else
            return NativeBridge.guid();
    },
    closeApp: function () {
        if (navigator.app)
            navigator.app.exit();
        else
            window.close();
    },
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }
}