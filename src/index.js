import "./styles.css";

function calcBtn() {
  let inputFormTLE = document.tleText.inputFormTLE.value;
  let inputFormLat = document.getElementById("inputFormLat");
  let inputFormLon = document.getElementById("inputFormLon");
  let inputFormHgt = document.getElementById("inputFormHgt");
  let inputFormStart = document.getElementById("inputFormStart");
  let inputFormStop = document.getElementById("inputFormStop");

  let inLat = Number(inputFormLat.value);
  let inLon = Number(inputFormLon.value);
  let inHgt = Number(inputFormHgt.value);
  let inSrt = inputFormStart.value;
  let inStp = inputFormStop.value;

  document.getElementById("span1").textContent = inputFormTLE;
  document.getElementById("span2").textContent = inLat;
  document.getElementById("span3").textContent = inLon;
  document.getElementById("span4").textContent = inHgt;
  document.getElementById("span5").textContent = inSrt;
  document.getElementById("span6").textContent = inStp;

  console.log("TLE: \n" + inputFormTLE);
  console.log("Lat: " + inLat);
  console.log("Lon: " + inLon);
  console.log("Height: " + inHgt);
  console.log("Start: " + inSrt);
  console.log("Stop: " + inStp);

  let tle1st = inputFormTLE.substr(0, 69);
  let tle2nd = inputFormTLE.substr(70, 138);
  console.log("1st_line: " + tle1st);
  console.log("2nd_line: " + tle2nd);

  //};
  //ここからorb2jsを使用した衛星位置計算///////////////////////////////////////
  var date = new Date();

  //日付変換：JSTからUTCへ
  //yyyymmddhhmmssを全て秒へその後９時間（32,400秒）を引いて戻す
  var jyear = Number(inSrt.substr(0, 4));
  var jmonth = Number(inSrt.substr(4, 2));
  jmonth--;
  var jday = Number(inSrt.substr(6, 2));
  var jhour = Number(inSrt.substr(8, 2));
  var jmin = Number(inSrt.substr(10, 2));
  var jsec = Number(inSrt.substr(12));
  var jstSrt = new Date(jyear, jmonth, jday, jhour, jmin, jsec);
  var utcSrt = new Date(jstSrt.getTime() - 1000 * 60 * 60 * 9); // UTCに変換
  console.log(jstSrt);
  console.log(utcSrt);

  var j2year = Number(inStp.substr(0, 4));
  var j2month = Number(inStp.substr(4, 2));
  j2month--;
  var j2day = Number(inStp.substr(6, 2));
  var j2hour = Number(inStp.substr(8, 2));
  var j2min = Number(inStp.substr(10, 2));
  var j2sec = Number(inStp.substr(12));
  var jstStp = new Date(j2year, j2month, j2day, j2hour, j2min, j2sec);
  var utcStp = new Date(jstStp.getTime() - 1000 * 60 * 60 * 9); // UTCに変換
  console.log(jstStp);
  console.log(utcStp);

  //二行軌道要素から人工衛星の位置
  var tle = {
    first_line:
      "1 25544U 98067A   15012.59173611  .00014829  00000-0  23845-3 0  7179",
    second_line:
      "2 25544 051.6466 140.7335 0006107 243.2909 291.5211 15.53213268923827"
  }; //オブジェクトリテラルp344
  tle.first_line = tle1st;
  tle.second_line = tle2nd;

  var satellite = new Orb.SGP4(tle);
  var xyz = satellite.xyz(jstSrt); // equatorial rectangular coordinates (x, y, z ,xdot, ydot, zdot)
  var latlng = satellite.latlng(jstSrt); // geographic spherical coordinates(latitude, longitude, altitude, velocity)

  //方位、高度の計算
  var your_location = {
    latitude: 35.658,
    longitude: 139.741,
    altitude: 0
  };

  your_location.latitude = inLat;
  your_location.longitude = inLon;
  your_location.altitude = inHgt;
  console.log(your_location.latitude);
  console.log(your_location.longitude);
  console.log(your_location.altitude);

  var observe_satellite = new Orb.Observation({
    observer: your_location,
    target: satellite
  });
  var horizontal = observe_satellite.azel(jstSrt); // horizontal coordinates(azimuth, elevation)
  var azimuth = horizontal.azimuth;
  var elevation = horizontal.elevation;
  console.log(azimuth);
  console.log(elevation);

  document.getElementById("orbcalcresult").value =
    "Date：" +
    jstSrt +
    "\n" +
    "地心直交座標X：" +
    xyz.x +
    "\n" +
    "地心直交座標Y：" +
    xyz.y +
    "\n" +
    "地心直交座標Z：" +
    xyz.z +
    "\n" +
    "緯度：" +
    latlng.latitude +
    "\n" +
    "経度：" +
    latlng.longitude +
    "\n" +
    "方位角：" +
    azimuth +
    "\n" +
    "仰角：" +
    elevation;
}

/*
1 39766U 14029A   20119.73335867 -.00000084  00000-0 -43721-5 0  9998
2 39766  97.9195 217.0418 0001421  88.6010 271.5380 14.79470067320340

Date：Wed Apr 29 2020 15:51:29 GMT+0900 (日本標準時)
地心直交座標X：-3253.966499175225
地心直交座標Y：-1445.4315988287997
地心直交座標Z：6029.706112464291
緯度：59.59092423008734
経度：-116.61124299371977
方位角：32.59892256567974
仰角：-0.5036120328801286
*/
