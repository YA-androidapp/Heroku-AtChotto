isEntered = false;
room = null;

markers = [];
userlocationsArray = [];

const MODE_LOCATION = 'location';

function rtc_init() {
    const peer = new Peer({
        key: '9a66ba38-4821-4385-a17e-b3a29e1aacf8', // The API key of Skyway (domain: atchotto.herokuapp.com)
        debug: 3
    });

    peer.on('open', id => {
        appendHistory('準備完了しました。入室してください。');
    });

    var enter = document.getElementById('enter');
    enter.addEventListener('click', function () {
        enter.disabled = true;
        var name = document.getElementById('name');
        var roomName = document.getElementById('roomName');
        var shareUrl = document.getElementById('shareUrl');

        if (location.href.indexOf("roomName=") < 0) {
            if (location.href.indexOf("?") > -1) {
                shareUrl.value = location.href + "&roomName=" + sanitaize.encalphanum(roomName.value);
            } else {
                shareUrl.value = location.href + "?roomName=" + sanitaize.encalphanum(roomName.value);
            }
        } else {
            shareUrl.value = location.href;
        }

        room = peer.joinRoom(sanitaize.encalphanum(roomName.value), {
            mode: 'sfu'
        });

        var entered = '<p><i class="name">' + sanitaize.encode(name.value) + '</i> entered ' + sanitaize.encalphanum(roomName.value) + '.</p>';
        appendHistory(entered);
        room.send(en(entered));
        isEntered = true;
        name.disabled = true;
        roomName.disabled = true;

        var lat = document.getElementById("latitude").innerText,
            long = document.getElementById("longitude").innerText;
        if (null != lat && "" != lat && null != long && "" != long) {
            console.log('entered ' + lat + ',' + long);
            sendLocation();
        }

        var send = document.getElementById('send');
        send.addEventListener('click', function () {
            send.disabled = true;
            var msg = document.getElementById('msg');
            var sent = '<p><i class="name">' + sanitaize.encode(name.value) + '</i> > <span class="message">' + sanitaize.encode(msg.value) +
                '</span></p>';
            room.send(en(sent));
            appendHistory(sent);
            send.disabled = false;
        });

        room.on('data', function (data) {
            var received = de(data.data);

            console.log('data');
            console.log(received);
            if (received.indexOf('<p class="' + MODE_LOCATION + '">') > -1) {
                // ユーザー・緯度・経度を抽出
                // 想定データ
                // received = '<p class="' + mode + '"><i class="name">name</i> @ <span class="lat">lat</span> , <span class="long">lo</span></p>'

                part1 = received.split('<i class="name">')[1]; // 'name</i> @ <span class="lat">lat</span> , <span class="long">lo</span></p>'
                // console.log(part1);
                part2 = part1.split('</span></p>')[0]; // 'name</i> @ <span class="lat">lat</span> , <span class="long">lo
                // console.log(part2);

                part3 = part2.split('</i> @ <span class="lat">');
                name = part3[0]; // 'name'
                // console.log(name);
                part4 = part3[1]; // 'lat</span> , <span class="long">lo'
                // console.log(part4);
                part5 = part4.split('</span> , <span class="long">');
                // console.log(part5);
                lat = part5[0]; // lat
                // console.log(lat);
                long = part5[1]; // long
                // console.log(long);

                // ユーザーごとに最新の位置を得る
                var userlocation = {
                    'name': name,
                    'lat': lat,
                    'long': long
                };
                userlocationsArray[name] = userlocation;

                // 経緯度を地図上にプロット
                for (var key in markers) {
                    map.removeLayer(markers[key]);
                }
                markers = [];

                var userListText = '<ul>\n';
                var myLat = Number(document.getElementById("latitude").innerText),
                    myLong = Number(document.getElementById("longitude").innerText);

                i = 0;
                for (var key in userlocationsArray) {
                    var val = userlocationsArray[key];

                    er = Math.random() / 10000;

                    var mpoint = [String(Number(val.lat) + er), String(Number(val.long) + er)];
                    markers.push(
                        L.marker(mpoint, {
                            icon: L.divIcon({
                                className: 'icon' + i,
                                iconAnchor: [13, 13]
                            })
                        }).bindTooltip(val.name).addTo(map)
                    );

                    userListText += '\n' +
                        '<li><i class="name">' + sanitaize.encode(name) +
                        '</i> <span onclick="move(' + lat + ',' + long + ')"> <span class="lat">' +
                        sanitaize.encllnum(Number(lat).toFixed(4)) + '</span> , <span class="long">' +
                        sanitaize.encllnum(Number(long).toFixed(4)) + '</span></span> ( <span class="dist">' +
                        calcDistance(Number(lat), Number(long), Number(myLat), Number(myLong)) + '</span> )</li>';

                    i++;
                }

                userListText += '</ul>\n';
                UpdateUserList(userListText);
            } else {
                appendHistory(received);
            }
        });

        enter.disabled = false;
    });
}

function sendLocation() {
    var name = document.getElementById('name');
    var la = document.getElementById("latitude").innerText;
    var lo = document.getElementById("longitude").innerText;
    if ((false == isNaN(la)) && (false == isNaN(lo))) {
        var sent = '<p class="' + MODE_LOCATION + '"><i class="name">' +
            sanitaize.encode(name.value) + '</i> @ <span class="lat">' +
            sanitaize.encllnum(la) + '</span> , <span class="long">' +
            sanitaize.encllnum(lo) + '</span></p>';
        if (null != room) {
            room.send(en(sent));
            appendHistory(sent);
        }
    }
}

function appendHistory(msg) {
    var history = document.getElementById('history');
    history.insertAdjacentHTML('afterbegin', msg);
}

function UpdateUserList(msg) {
    var userList = document.getElementById('userList');
    userList.innerHTML = msg;
}

function move(latitude, longitude) {
    if ((false == isNaN(latitude)) && (false == isNaN(longitude))) {
        if (map) {
            var currentZoom = map.getZoom();
            var newZoom = currentZoom ? currentZoom : 14;

            mpoint = [latitude, longitude];
            map.setView(mpoint, newZoom);
        }
    }
}

function moveAndSend() {
    var latitude = document.getElementById("latitude").innerText;
    var longitude = document.getElementById("longitude").innerText;
    if ((false == isNaN(latitude)) && (false == isNaN(longitude))) {
        move(latitude, longitude);
        sendLocation();
    }
}

var latitude = document.getElementById('latitude');
latitude.addEventListener('click', function () {
    moveAndSend();
});

var longitude = document.getElementById('longitude');
longitude.addEventListener('click', function () {
    moveAndSend();
});

function isNumber(x) {
    if (typeof (x) != 'number' && typeof (x) != 'string')
        return false;
    else
        return (x == parseFloat(x) && isFinite(x));
}

function calcDistance(lat1, long1, lat2, long2) {
    if (!isNumber(lat1) || !isNumber(long1) || !isNumber(lat2) || !isNumber(long2)) {
        return null;
    }

    lat1 *= Math.PI / 180;
    long1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    long2 *= Math.PI / 180;

    var km = 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(long2 - long1) + Math.sin(lat1) * Math.sin(lat2));
    if (km >= 1) {
        return Number(km).toFixed(3) + 'km';
    } else {
        return Number(1000 * km).toFixed(2) + 'm';
    }
}