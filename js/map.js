map = null;

function map_init() {
    map = L.map('map', {
        zoomControl: true
    });
    var mpoint = [35.531388046719215, 139.69683229923248];

    var currentZoom = map.getZoom();
    var newZoom = currentZoom ? currentZoom : 14;
    map.setView(mpoint, newZoom);
    L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
    }).addTo(map);
}