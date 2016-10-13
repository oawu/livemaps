/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 * @website     http://www.ioa.tw/
 */

$(function () {
  window.vars.$.maps = $('#maps');
  window.vars.$.send = $('#send');
  window.vars.$.myMessage = $('#my_message');
  window.vars.$.zoomIn = $('#zoom_in');
  window.vars.$.zoomOut = $('#zoom_out');
  window.vars.$.plus = $('#plus');
  window.vars.$.facebook = $('#facebook');
  window.vars.$.loading = $('#loading');
  window.vars.$.login = $('#login');
  window.vars.$.relogin = $('#relogin');
  window.vars.$.step1 = $('#step1');
  window.vars.$.step2 = $('#step2');
  window.vars.$.step3 = $('#step3');
  window.vars.$.popbox = $('.popbox');
  window.vars.$.title = $('title');
  window.vars.$.chat = $('#chat');
  window.vars.$.history = $('#history');
  window.vars.$.gpson = $('#gpson');
  window.vars.$.notification = $('#notification');

  window.vars.$.markerMenu = $('#marker_menu');

  window.vars.hasOpenGeo = false;
  window.vars.content = '';
  window.vars.name = '遊客';
  window.vars.src = 'img/d4_user.png';
  window.vars.hasAudio = false;

  window.vars.points = {};
  window.vars.z = 0;
  window.vars.audio = {
    pop: new Audio('pop.mp3'),
    chat: new Audio('chat.mp3')
  };

  window.vars.$.popbox.find ('.cover, .cancel').click (function () { window.vars.$.popbox.removeClass ('show'); });
  
  window.funcs.addZero = function (i) { return i < 10 ? '0' + i : i; };
  window.funcs.getDatetime = function () { var date = new Date (), year = date.getFullYear (), month = date.getMonth () + 1, day = date.getDate (), hour = date.getHours (), min = date.getMinutes (), sec = date.getSeconds (); return year + '-' + window.funcs.addZero (month) + '-' + window.funcs.addZero (day) + ' ' + window.funcs.addZero (hour) + ':' + window.funcs.addZero (min) + ':' + window.funcs.addZero (sec); };
  window.funcs.updateTitle = function (data) { window.vars.$.title.text ('' + Object.keys (window.vars.points).length + ' 位使用者在地圖上 - LiveMaps'); };
  window.funcs.renderUser = function (obj, content) { return $('<div />').addClass ('user').append ($('<div />').addClass ('avatar').append ($('<img />').attr ('alt', obj.name).attr ('src', obj.src)).imgLiquid ({verticalAlign: 'center'})).append ($('<div />').addClass ('content').text (content = typeof content == 'undefined' ? '' : content)).html (); };
  window.funcs.getPixelPosition = function (obj) { var scale = Math.pow (2, obj.map.getZoom ()), nw = new google.maps.LatLng (obj.map.getBounds ().getNorthEast ().lat (), obj.map.getBounds ().getSouthWest ().lng ()), worldCoordinateNW = obj.map.getProjection ().fromLatLngToPoint (nw), worldCoordinate = obj.map.getProjection ().fromLatLngToPoint (obj.getPosition ()); return new google.maps.Point ((worldCoordinate.x - worldCoordinateNW.x) * scale, (worldCoordinate.y - worldCoordinateNW.y) * scale); };
  window.funcs.showForm = function () { window.vars.$.plus.toggleClass ('open'); if (window.vars.$.plus.hasClass ('open')) window.vars.myMessageTimer =  setTimeout (function () { window.vars.$.myMessage.focus (); }, 500); else clearTimeout (window.vars.myMessageTimer); };
  window.funcs.getFbData = function (cb) { FB.api('/me', function (response) { window.storages.user.set ({ fbuid: response.id, name: response.name, src: 'https://graph.facebook.com/' + response.id + '/picture?width=100&height=100' }); window.funcs.removeSameUser (response.id); return cb && cb (response); }); };
  window.funcs.checkLoginState = function (cb, eb) { FB.getLoginStatus (function (response) { if (response.status != 'connected') return window.storages.user.set (null) && eb && eb (); return cb && cb (response); }); return eb && eb (); };
  window.funcs.initFB = function () { if (!window.storages.user.get ()) window.funcs.checkLoginState (function () { window.funcs.getFbData (); }, function () { window.vars.$.facebook.click (function () { window.vars.$.loading.addClass ('show').find ('.txt').text ('登入中，請稍候..'); FB.login (function (response) { if (response.status != 'connected') return window.vars.$.loading.removeClass ('show') && window.vars.$.facebook.prev ().text ('登入失敗..'); window.funcs.getFbData (function () { window.vars.$.loading.removeClass ('show'); window.vars.$.facebook.parents ('.popbox').removeClass ('show'); window.funcs.showForm (); }); }, {scope: 'public_profile,email'}); }); }); };
  window.funcs.initStepFirebase = function () {
    if (!window.firebaseConfig) {
      // Error
    }
    firebase.initializeApp (window.firebaseConfig); window.vars.firebaseDB = firebase.database (); window.vars.firebaseDB.ref ('version/').on ('value', function (snapshot) { if (window.vars.version != snapshot.val ()) location.reload (); }); window.vars.firebaseUserRef = window.vars.firebaseDB.ref ('users/'); };

  window.funcs.showHistory = function (data) {
    window.vars.$.loading.addClass ('show').find ('.txt').text ('讀取中，請稍候..');
    var ref = window.vars.firebaseDB.ref ('messages/' + data.uid);
    var on = ref.limitToLast (100).on ('value', function (snapshot) {
      var msgs = []; for (var i in snapshot.val ()) msgs.push (snapshot.val ()[i]);

      window.vars.$.loading.removeClass ('show');
      window.vars.$.history.find ('h4').text (data.name + ' 的訊息紀錄');
      window.vars.$.history.find ('.panel_content').empty ().append (msgs.map (function (t) {
        return $('<div />').addClass ('he').append (
          $('<div />').addClass ('avatar').append (
            $('<img />').attr ('src', data.src))).append (
          $('<span />').text (t.content)).append (
          $('<time />').text ($.timeago (t.time)));
      }));
      window.vars.$.history.addClass ('show');
    });
    window.vars.$.history.get (0).firebase = { ref: ref, on: on };
  };

  window.funcs.initGeoFeature = function (cb) {
    if (window.navigator.geolocation === undefined || navigator.geolocation.watchPosition === undefined) return window.vars.$.loading.removeClass ('show');
    $(window).on ('beforeunload', function () { window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/enable/').set (0); });
    $(window).on ('pagehide', function () { window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/enable/').set (0); });

    navigator.geolocation.watchPosition (function (position) {
      if (!window.vars.hasOpenGeo) window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get ()).set ({ uid: window.storages.uuid.get (), name: window.storages.user.get () ? window.storages.user.get ().name : window.vars.name, src: window.storages.user.get () ? window.storages.user.get ().src : window.vars.src, enable: 1, fbuid: window.storages.user.get () ? window.storages.user.get ().fbuid : 0, location: { lat: position.coords.latitude, lng: position.coords.longitude } });
      else window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/location').set ({ lat: position.coords.latitude, lng: position.coords.longitude });
      if(!window.vars.hasOpenGeo && (window.vars.hasOpenGeo = true)) return window.vars.$.loading.removeClass ('show');

      window.vars.maps.setZoom (13);
      window.vars.maps.setCenter (new google.maps.LatLng (position.coords.latitude, position.coords.longitude));
      return window.vars.$.loading.removeClass ('show') && cb && cb ();
    }, function () {
      return window.vars.$.loading.removeClass ('show') && cb && cb ();
    }, { enableHighAccuracy: true });
  };

  window.funcs.appendUser = function (snapshot) {
    var data = null;
    if (!(snapshot && (data = snapshot.val ()) && (typeof data.uid != 'undefined') && (data.uid.length > 0) && (typeof data.name != 'undefined') && (data.name.length > 0) && (typeof data.src != 'undefined') && (data.src.length > 0) && (typeof data.enable != 'undefined') && (data.enable != 0) && (typeof data.location != 'undefined') && (Object.keys (data.location).length == 2) && (typeof data.location.lat != 'undefined') && (data.location.lat >= -90 ) && (data.location.lat <= 90 ) && (typeof data.location.lng != 'undefined') && (data.location.lng >= -180) && (data.location.lng <= 180) && (typeof window.vars.points[data.uid] == 'undefined'))) return ;

    var position = new google.maps.LatLng (data.location.lat, data.location.lng);
    var content = window.funcs.renderUser (data);
    
    window.vars.points[data.uid] = {
      marker: new MarkerWithLabel ({
        map: window.vars.maps, labelAnchor: new google.maps.Point (45 / 2, 45 / 2), icon: {path: 'M 0 0'}, labelClass: 'user',
        position: position,
        labelContent: content,
        zIndex: 0
      }),
      timers: [],
      data: data
    };

    window.vars.points[data.uid].timers.push (setTimeout (function () {
      window.vars.points[data.uid].marker.setOptions ({ labelClass: 'user show' });
      window.vars.points[data.uid].timers = [];
    }, 500));

    window.vars.points[data.uid].on = {
      message: window.vars.firebaseDB.ref ('messages/' + data.uid + '/').limitToLast(1).on ('value', function (snapshot) {
        var msg = null; for (var i in snapshot.val ()) msg = snapshot.val ()[i]; if (!msg) return ;
        window.vars.points[data.uid].marker.setOptions ({ zIndex: ++window.vars.z, labelContent: window.funcs.renderUser (window.vars.points[data.uid].data, msg.content) });
        window.vars.points[data.uid].timers.push (setTimeout (function () {
          window.vars.points[data.uid].marker.setOptions ({ labelClass: 'user show message' });
          window.vars.points[data.uid].timers = [];
          if (data.uid != window.storages.uuid.get () && window.vars.hasAudio) window.vars.audio.chat.play ();
        }, 500));
      }),
      location: window.vars.firebaseDB.ref ('users/' + data.uid + '/location/').on ('value', function (snapshot) {
        window.vars.points[data.uid].data.location = snapshot.val ();
        window.vars.points[data.uid].marker.setPosition (new google.maps.LatLng (snapshot.val ().lat, snapshot.val ().lng));
      }),
      name: window.vars.firebaseDB.ref ('users/' + data.uid + '/name/').on ('value', function (snapshot) {
        window.vars.points[data.uid].data.name = snapshot.val ();
        window.vars.points[data.uid].marker.setOptions ({ labelContent: window.funcs.renderUser (window.vars.points[data.uid].data) });
      }),
      src: window.vars.firebaseDB.ref ('users/' + data.uid + '/src/').on ('value', function (snapshot) {
        window.vars.points[data.uid].data.src = snapshot.val ();
        window.vars.points[data.uid].marker.setOptions ({ labelContent: window.funcs.renderUser (window.vars.points[data.uid].data) });
      }),
      fbuid: window.vars.firebaseDB.ref ('users/' + data.uid + '/fbuid/').on ('value', function (snapshot) {
        window.vars.points[data.uid].data.fbuid = snapshot.val ();
        window.vars.points[data.uid].marker.setOptions ({ labelContent: window.funcs.renderUser (window.vars.points[data.uid].data) });
      }),
    };

    window.vars.points[data.uid].marker.addListener ('click', function (e) { window.funcs.showHistory (data); });
    window.funcs.updateTitle ();
      
    if (data.uid != window.storages.uuid.get () && window.vars.hasAudio)  window.vars.audio.pop.play ();
  };

  window.funcs.removeUser = function (snapshot) {
    var data = null;
    if (!(snapshot && (data = snapshot.val ()) && (typeof data.uid != 'undefined') && (data.uid.length > 0) && (typeof window.vars.points[data.uid] != 'undefined'))) return ;

    window.vars.firebaseDB.ref ('messages/' + data.uid + '/').off ('value', window.vars.points[data.uid].on.message);
    window.vars.firebaseDB.ref ('users/' + data.uid + '/location/').off ('value', window.vars.points[data.uid].on.location);
    window.vars.firebaseDB.ref ('users/' + data.uid + '/name/').off ('value', window.vars.points[data.uid].on.name);
    window.vars.firebaseDB.ref ('users/' + data.uid + '/src/').off ('value', window.vars.points[data.uid].on.src);
    window.vars.firebaseDB.ref ('users/' + data.uid + '/fbuid/').off ('value', window.vars.points[data.uid].on.fbuid);
    
    window.vars.points[data.uid].marker.setOptions ({ labelClass: 'user' });
    window.vars.points[data.uid].marker.setMap (null);
    window.vars.points[data.uid].timers.forEach (clearTimeout);
    delete window.vars.points[data.uid];

    if (data.uid == window.storages.uuid.get ()) { window.vars.$.relogin.addClass ('show'); throw new Error ("重複登入囉！"); }
    window.funcs.updateTitle ();
  };

  window.funcs.removeSameUser = function (fbuid) {
    if (!fbuid) return;

    window.vars.firebaseUserRef.orderByChild ('fbuid').equalTo ('' + fbuid).once ('value', function (snapshot) {
      for (var i in snapshot.val ()) if (i != window.storages.uuid.get ()) window.vars.firebaseDB.ref ('users/' + i + '/enable/').set (0);
    });

    window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/fbuid/').set (window.storages.user.get ().fbuid);
    window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/name/').set (window.storages.user.get ().name);
    window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/src/').set (window.storages.user.get ().src);
  };

  window.funcs.initStep = function (cb) {
    window.vars.$.loading.removeClass ('show');

    window.vars.$.step1.addClass ('show').find ('.cover, .cancel').click (function () {
      window.vars.$.step2.addClass ('show');
    });

    window.vars.$.step2.find ('.cover, .cancel').click (function () {
      window.vars.$.step3.addClass ('show');
    });
    window.vars.$.step3.find ('.cover, .cancel').click (function () {
      window.storages.inited.set ('yes');
      window.vars.$.loading.addClass ('show').find ('.txt').text ('初始中，請稍候..');
      window.funcs.initGeoFeature (cb);
    });
  };

  window.funcs.initStepFirebase ();
  
  google.maps.event.addDomListener (window, 'load', function () {
    var mapsLastPosition = window.storages.mapsLastPosition.get ();
    window.vars.maps = new google.maps.Map (window.vars.$.maps.get (0), { zoom: mapsLastPosition.zoom, center: new google.maps.LatLng (mapsLastPosition.lat, mapsLastPosition.lng)});

    window.vars.maps.mapTypes.set ('style1', new google.maps.StyledMapType ([{featureType: 'all', stylers: [{ visibility: 'on' }]}, {featureType: 'administrative', stylers: [{ visibility: 'simplified' }]}, {featureType: 'landscape', stylers: [{ visibility: 'simplified' }]}, {featureType: 'poi', stylers: [{ visibility: 'simplified' }]}, {featureType: 'road', stylers: [{ visibility: 'simplified' }]}, {featureType: 'road.arterial', stylers: [{ visibility: 'simplified' }]}, {featureType: 'transit', stylers: [{ visibility: 'simplified' }]}, {featureType: 'water', stylers: [{ color: '#b3d1ff', visibility: 'simplified' }]}, {elementType: "labels.icon", stylers:[{ visibility: 'off' }]}]));
    window.vars.maps.setMapTypeId ('style1');
    window.vars.maps.addListener ('idle', function () { window.storages.mapsLastPosition.set ({zoom: window.vars.maps.zoom, lat: window.vars.maps.center.lat (), lng: window.vars.maps.center.lng ()}); });

    window.vars.firebaseUserRef.orderByChild ('enable').equalTo (1).on ('child_added', window.funcs.appendUser);
    window.vars.firebaseUserRef.orderByChild ('enable').equalTo (0).on ('child_added', window.funcs.removeUser);
    
    window.funcs.initFB ();
    if (window.storages.user.get ())
    window.funcs.removeSameUser (window.storages.user.get ().fbuid);
    
    window.vars.$.zoomIn.click (function () { window.vars.maps.setZoom (window.vars.maps.zoom + 1); }).addClass ('show');
    window.vars.$.zoomOut.click (function () { window.vars.maps.setZoom (window.vars.maps.zoom - 1); }).addClass ('show');
    window.vars.$.send.click (function () { var val = window.vars.$.myMessage.val ().trim (); if (!val.length) return ; window.vars.firebaseDB.ref ('messages/' + window.storages.uuid.get ()).push ({ content: val, time: window.funcs.getDatetime () }); window.vars.$.myMessage.val (''); });
    window.vars.$.relogin.find ('.cover, .ok').click (function () { location.reload (); });
    window.vars.$.myMessage.keyup (function (e) { if (e.keyCode == 13) window.vars.$.send.click (); });
    window.vars.$.history.find ('.ok').click (function () { window.vars.$.history.removeClass ('show').get (0).firebase.ref.off ('value', window.vars.$.history.get (0).firebase.on); });
    window.vars.$.notification.attr ('title', '目前 ' + (window.storages.audio.get () == 'on' ? '開啟' : '關閉')).addClass (window.storages.audio.get () == 'on' ? 'icon-notification_active' : 'icon-notification_off').addClass ('show').click (function () { window.storages.audio.set (window.storages.audio.get () == 'on' ? 'off' : 'on'); window.vars.hasAudio = window.storages.audio.get () == 'on' ? true : false; $(this).attr ('title', '目前 ' + (window.storages.audio.get () == 'on' ? '開啟' : '關閉')).attr ('class', window.storages.audio.get () == 'on' ? 'icon-notification_active show' : 'icon-notification_off show'); });
    window.vars.$.login.find ('.ok').click (function () { window.vars.$.popbox.removeClass ('show'); return window.funcs.showForm (); });
  
    window.vars.$.plus.click (function () {
      window.vars.$.loading.addClass ('show').find ('.txt').text ('定位中，請稍候..');
      if (!window.vars.hasOpenGeo) { window.vars.$.loading.removeClass ('show'); return window.vars.$.gpson.addClass ('show'); }
      if (!$(this).hasClass ('open') && !window.storages.user.get ()) { window.vars.$.loading.removeClass ('show'); window.vars.$.login.find ('span').text (''); return window.vars.$.login.addClass ('show'); }
      window.vars.$.loading.removeClass ('show'); return window.funcs.showForm ();
    }).addClass ('show');

    var audio = function () { setTimeout (function () { window.vars.hasAudio = window.storages.audio.get (); }, 2000); };

    if (window.storages.inited.get () === 'no') window.funcs.initStep (audio);
    else window.funcs.initGeoFeature (audio);
  });
});