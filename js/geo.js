function geoFindMe() {

    if (!navigator.geolocation) {
        document.getElementById("map").innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function geo_success(position) {
        document.getElementById("latitude").innerText = position.coords.latitude;
        document.getElementById("longitude").innerText = position.coords.longitude;
        moveAndSend();
    }

    function geo_error(error) {
        output.innerHTML = 'ERROR(' + error.code + '): ' + error.message;
    }

    // とりあえず低精度で速やかに測位
    navigator.geolocation.getCurrentPosition(geo_success, geo_error);

    // GPS等による高精度測位を非同期的に継続
    var geo_options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
    };
    var watchID = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    // navigator.geolocation.clearWatch(watchID);
}

var revGeocode = document.getElementById('revGeocode');
revGeocode.addEventListener('click', function () {
    var lat = document.getElementById("latitude").innerText,
        long = document.getElementById("longitude").innerText;
    reverseGeocode(lat, long);
}, false);

function reverseGeocode(lat, long) {
    if ((false == isNaN(lat)) && (false == isNaN(long))) {
        var address = "";

        var script = document.createElement('script');
        script.src = 'https://www.finds.jp/ws/rgeocode.php?jsonp=caller&lat=' + lat + '&lon=' + long;
        window.caller = function (response) {
            if (response != null) {
                if (response.result != null) {
                    if (response.result.prefecture != null) {
                        if (response.result.prefecture.pname != null) {
                            address += response.result.prefecture.pname;
                        }
                    }
                    if (response.result.municipality != null) {
                        if (response.result.municipality.mname != null) {
                            address += response.result.municipality.mname;
                        }
                    }
                    if (response.result.local != null) {
                        if (response.result.local[0] != null) {
                            if (response.result.local[0].section != null) {
                                address += response.result.local[0].section;
                            } else if (response.result.local.section != null) {
                                address += response.result.local.section;
                            }
                        }
                    }
                }
            }

            document.getElementById("address").value = address;
        };
        document.body.appendChild(script);
    }
}