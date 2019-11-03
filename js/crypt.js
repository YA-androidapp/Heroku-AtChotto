var Base64 = {
    encode: function (str) {
        return btoa(unescape(encodeURIComponent(str)));
    },
    decode: function (str) {
        return decodeURIComponent(escape(atob(str)));
    }
};

function en(plaintext) {
    var passphrase = sanitaize.encalphanum(document.getElementById('roomName').value);
    var utf8_plain = CryptoJS.enc.Utf8.parse(plaintext);
    return Base64.encode(CryptoJS.AES.encrypt(utf8_plain, passphrase));
}

function de(encryptedtext) {
    var passphrase = sanitaize.encalphanum(document.getElementById('roomName').value);
    try {
        return CryptoJS.AES.decrypt(Base64.decode(encryptedtext), passphrase).toString(
            CryptoJS.enc.Utf8);
    } catch (error) {
        return '';
    }
}