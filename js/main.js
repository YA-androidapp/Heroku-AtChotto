window.onload = function () {
    form_init();
    rtc_init();
    map_init();
    geoFindMe();

    latlng_init();
}

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(location.search);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function form_init() {
    var roomNameValue = getUrlParameter("roomName");
    var roomName = document.getElementById('roomName');
    if (null != roomNameValue && "" != roomNameValue) {
        roomName.value = sanitaize.encalphanum(roomNameValue);
    } else {
        // var random = 1000 + Math.floor(Math.random() * 1000); // 1000～1999を生成
        var random = uuid();
        roomName.value = random;
    }

    var nameValue = getUrlParameter("name");
    var name = document.getElementById('name');
    name.addEventListener('change', function () {
        if (('localStorage' in window) && (window.localStorage !== null)) {
            localStorage.setItem('name', document.getElementById('name').value);
            // console.log('save name: ' + document.getElementById('name').value);
        }
    }, false);
    loadedName = localStorage.getItem('name');

    if (null != nameValue && "" != nameValue) {
        name.value = sanitaize.encalphanum(nameValue);
    } else if (loadedName && loadedName.length > 0) {
        name.value = sanitaize.encode(loadedName);
    } else {
        var random = Math.floor(Math.random() * 100); // 0～99を生成
        name.value = 'User' + random;
    }

    var shareWith = document.getElementById('shareWith');
    shareWith.addEventListener('change', function () {
        var param_name = 'name';

        var shareUrlValue = document.getElementById("shareUrl").value;
        if (null != shareUrlValue && "" != shareUrlValue) {
            if ((shareUrlValue.indexOf('?' + param_name + '=') > -1) || (shareUrlValue.indexOf('&' + param_name + '=') > -1)) {
                var shareWithValue = document.getElementById('shareWith').value;
                document.getElementById("shareUrl").value = shareUrlValue.replace(/([?&]name=).*?(&|$)/, '$1' + shareWithValue + '$2');
            } else {
                var shareWithValue = document.getElementById('shareWith').value;
                document.getElementById("shareUrl").value = shareUrlValue + (shareUrlValue.indexOf('?') > -1 ? '&' : '?') + param_name + '=' + shareWithValue;
            }
        }
    }, false);

    var copyUrl = document.getElementById('copyUrl');
    copyUrl.addEventListener('click', function () {
        var copyTarget = document.getElementById("shareUrl");
        copyTarget.select();
        document.execCommand("Copy");
    }, false);

    var copyAddress = document.getElementById('copyAddress');
    copyAddress.addEventListener('click', function () {
        var copyTarget = document.getElementById("address");
        copyTarget.select();
        document.execCommand("Copy");
    }, false);

    var copyAddress = document.getElementById('copyAddress');
    copyAddress.addEventListener('click', function () {
        var copyTarget = document.getElementById("address");
        copyTarget.select();
        document.execCommand("Copy");
    }, false);
}

sanitaize = {
    encode: function (str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    decode: function (str) {
        return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
    },

    encalphanum: function (str) {
        return str.replace(/[^0-9a-zA-Z-]/g, '');
    },

    encllnum: function (str) {
        return str.replace(/[^-0-9.]/g, '');
    }
};

function latlng_init() {
    document.getElementById('latitude').addEventListener('click', function clickEvent(ev) {
        moveAndSend();
    });
    document.getElementById('longitude').addEventListener('click', function clickEvent(ev) {
        moveAndSend();
    });
}

function uuid() {
    var uuid = "",
        i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}