/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 * @website     http://www.ioa.tw/
 */

// markerwithlabel_d2015_06_28
function inherits(e,t){function i(){}i.prototype=t.prototype,e.superClass_=t.prototype,e.prototype=new i,e.prototype.constructor=e}function MarkerLabel_(e,t,i){this.marker_=e,this.handCursorURL_=e.handCursorURL,this.labelDiv_=document.createElement("div"),this.labelDiv_.style.cssText="position: absolute; overflow: hidden;",this.eventDiv_=document.createElement("div"),this.eventDiv_.style.cssText=this.labelDiv_.style.cssText,this.eventDiv_.setAttribute("onselectstart","return false;"),this.eventDiv_.setAttribute("ondragstart","return false;"),this.crossDiv_=MarkerLabel_.getSharedCross(t)}function MarkerWithLabel(e){e=e||{},e.labelContent=e.labelContent||"",e.initCallback=e.initCallback||function(){},e.labelAnchor=e.labelAnchor||new google.maps.Point(0,0),e.labelClass=e.labelClass||"markerLabels",e.labelStyle=e.labelStyle||{},e.labelInBackground=e.labelInBackground||!1,"undefined"==typeof e.labelVisible&&(e.labelVisible=!0),"undefined"==typeof e.raiseOnDrag&&(e.raiseOnDrag=!0),"undefined"==typeof e.clickable&&(e.clickable=!0),"undefined"==typeof e.draggable&&(e.draggable=!1),"undefined"==typeof e.optimized&&(e.optimized=!1),e.crossImage=e.crossImage||"http"+("https:"===document.location.protocol?"s":"")+"://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png",e.handCursor=e.handCursor||"http"+("https:"===document.location.protocol?"s":"")+"://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur",e.optimized=!1,this.label=new MarkerLabel_(this,e.crossImage,e.handCursor),google.maps.Marker.apply(this,arguments)}inherits(MarkerLabel_,google.maps.OverlayView),MarkerLabel_.getSharedCross=function(e){var t;return"undefined"==typeof MarkerLabel_.getSharedCross.crossDiv&&(t=document.createElement("img"),t.style.cssText="position: absolute; z-index: 1000002; display: none;",t.style.marginLeft="-8px",t.style.marginTop="-9px",t.src=e,MarkerLabel_.getSharedCross.crossDiv=t),MarkerLabel_.getSharedCross.crossDiv},MarkerLabel_.prototype.onAdd=function(){var e,t,i,s,a,r,o,n=this,l=!1,g=!1,p=20,_="url("+this.handCursorURL_+")",v=function(e){e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation()},h=function(){n.marker_.setAnimation(null)};this.getPanes().overlayImage.appendChild(this.labelDiv_),this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_),"undefined"==typeof MarkerLabel_.getSharedCross.processed&&(this.getPanes().overlayImage.appendChild(this.crossDiv_),MarkerLabel_.getSharedCross.processed=!0),this.listeners_=[google.maps.event.addDomListener(this.eventDiv_,"mouseover",function(e){(n.marker_.getDraggable()||n.marker_.getClickable())&&(this.style.cursor="pointer",google.maps.event.trigger(n.marker_,"mouseover",e))}),google.maps.event.addDomListener(this.eventDiv_,"mouseout",function(e){!n.marker_.getDraggable()&&!n.marker_.getClickable()||g||(this.style.cursor=n.marker_.getCursor(),google.maps.event.trigger(n.marker_,"mouseout",e))}),google.maps.event.addDomListener(this.eventDiv_,"mousedown",function(e){g=!1,n.marker_.getDraggable()&&(l=!0,this.style.cursor=_),(n.marker_.getDraggable()||n.marker_.getClickable())&&(google.maps.event.trigger(n.marker_,"mousedown",e),v(e))}),google.maps.event.addDomListener(document,"mouseup",function(t){var i;if(l&&(l=!1,n.eventDiv_.style.cursor="pointer",google.maps.event.trigger(n.marker_,"mouseup",t)),g){if(a){i=n.getProjection().fromLatLngToDivPixel(n.marker_.getPosition()),i.y+=p,n.marker_.setPosition(n.getProjection().fromDivPixelToLatLng(i));try{n.marker_.setAnimation(google.maps.Animation.BOUNCE),setTimeout(h,1406)}catch(r){}}n.crossDiv_.style.display="none",n.marker_.setZIndex(e),s=!0,g=!1,t.latLng=n.marker_.getPosition(),google.maps.event.trigger(n.marker_,"dragend",t)}}),google.maps.event.addListener(n.marker_.getMap(),"mousemove",function(s){var _;l&&(g?(s.latLng=new google.maps.LatLng(s.latLng.lat()-t,s.latLng.lng()-i),_=n.getProjection().fromLatLngToDivPixel(s.latLng),a&&(n.crossDiv_.style.left=_.x+"px",n.crossDiv_.style.top=_.y+"px",n.crossDiv_.style.display="",_.y-=p),n.marker_.setPosition(n.getProjection().fromDivPixelToLatLng(_)),a&&(n.eventDiv_.style.top=_.y+p+"px"),google.maps.event.trigger(n.marker_,"drag",s)):(t=s.latLng.lat()-n.marker_.getPosition().lat(),i=s.latLng.lng()-n.marker_.getPosition().lng(),e=n.marker_.getZIndex(),r=n.marker_.getPosition(),o=n.marker_.getMap().getCenter(),a=n.marker_.get("raiseOnDrag"),g=!0,n.marker_.setZIndex(1e6),s.latLng=n.marker_.getPosition(),google.maps.event.trigger(n.marker_,"dragstart",s)))}),google.maps.event.addDomListener(document,"keydown",function(e){g&&27===e.keyCode&&(a=!1,n.marker_.setPosition(r),n.marker_.getMap().setCenter(o),google.maps.event.trigger(document,"mouseup",e))}),google.maps.event.addDomListener(this.eventDiv_,"click",function(e){(n.marker_.getDraggable()||n.marker_.getClickable())&&(s?s=!1:(google.maps.event.trigger(n.marker_,"click",e),v(e)))}),google.maps.event.addDomListener(this.eventDiv_,"dblclick",function(e){(n.marker_.getDraggable()||n.marker_.getClickable())&&(google.maps.event.trigger(n.marker_,"dblclick",e),v(e))}),google.maps.event.addListener(this.marker_,"dragstart",function(e){g||(a=this.get("raiseOnDrag"))}),google.maps.event.addListener(this.marker_,"drag",function(e){g||a&&(n.setPosition(p),n.labelDiv_.style.zIndex=1e6+(this.get("labelInBackground")?-1:1))}),google.maps.event.addListener(this.marker_,"dragend",function(e){g||a&&n.setPosition(0)}),google.maps.event.addListener(this.marker_,"position_changed",function(){n.setPosition()}),google.maps.event.addListener(this.marker_,"zindex_changed",function(){n.setZIndex()}),google.maps.event.addListener(this.marker_,"visible_changed",function(){n.setVisible()}),google.maps.event.addListener(this.marker_,"labelvisible_changed",function(){n.setVisible()}),google.maps.event.addListener(this.marker_,"title_changed",function(){n.setTitle()}),google.maps.event.addListener(this.marker_,"labelcontent_changed",function(){n.setContent()}),google.maps.event.addListener(this.marker_,"labelanchor_changed",function(){n.setAnchor()}),google.maps.event.addListener(this.marker_,"labelclass_changed",function(){n.setStyles()}),google.maps.event.addListener(this.marker_,"labelstyle_changed",function(){n.setStyles()})]},MarkerLabel_.prototype.onRemove=function(){var e;for(this.labelDiv_.parentNode.removeChild(this.labelDiv_),this.eventDiv_.parentNode.removeChild(this.eventDiv_),e=0;e<this.listeners_.length;e++)google.maps.event.removeListener(this.listeners_[e])},MarkerLabel_.prototype.draw=function(){this.setContent(),this.setTitle(),this.setStyles()},MarkerLabel_.prototype.setContent=function(){var e=this.marker_.get("labelContent");"undefined"==typeof e.nodeType?(this.labelDiv_.innerHTML=e,this.eventDiv_.innerHTML=this.labelDiv_.innerHTML):(this.labelDiv_.innerHTML="",this.labelDiv_.appendChild(e),e=e.cloneNode(!0),this.eventDiv_.innerHTML="",this.eventDiv_.appendChild(e))},MarkerLabel_.prototype.setTitle=function(){this.eventDiv_.title=this.marker_.getTitle()||""},MarkerLabel_.prototype.setStyles=function(){var e,t;this.labelDiv_.className=this.marker_.get("labelClass"),this.eventDiv_.className=this.labelDiv_.className,this.labelDiv_.style.cssText="",this.eventDiv_.style.cssText="",t=this.marker_.get("labelStyle");for(e in t)t.hasOwnProperty(e)&&(this.labelDiv_.style[e]=t[e],this.eventDiv_.style[e]=t[e]);this.setMandatoryStyles()},MarkerLabel_.prototype.setMandatoryStyles=function(){this.labelDiv_.style.position="absolute",this.labelDiv_.style.overflow="","undefined"!=typeof this.labelDiv_.style.opacity&&""!==this.labelDiv_.style.opacity&&(this.labelDiv_.style.MsFilter='"progid:DXImageTransform.Microsoft.Alpha(opacity='+100*this.labelDiv_.style.opacity+')"',this.labelDiv_.style.filter="alpha(opacity="+100*this.labelDiv_.style.opacity+")"),this.eventDiv_.style.position=this.labelDiv_.style.position,this.eventDiv_.style.overflow=this.labelDiv_.style.overflow,this.eventDiv_.style.opacity=.01,this.eventDiv_.style.MsFilter='"progid:DXImageTransform.Microsoft.Alpha(opacity=1)"',this.eventDiv_.style.filter="alpha(opacity=1)",this.setAnchor(),this.setPosition(),this.setVisible()},MarkerLabel_.prototype.setAnchor=function(){var e=this.marker_.get("labelAnchor");this.labelDiv_.style.marginLeft=-e.x+"px",this.labelDiv_.style.marginTop=-e.y+"px",this.eventDiv_.style.marginLeft=-e.x+"px",this.eventDiv_.style.marginTop=-e.y+"px"},MarkerLabel_.prototype.setPosition=function(e){var t=this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());"undefined"==typeof e&&(e=0),this.labelDiv_.style.left=Math.round(t.x)+"px",this.labelDiv_.style.top=Math.round(t.y-e)+"px",this.eventDiv_.style.left=this.labelDiv_.style.left,this.eventDiv_.style.top=this.labelDiv_.style.top,this.setZIndex()},MarkerLabel_.prototype.setZIndex=function(){var e=this.marker_.get("labelInBackground")?-1:1;"undefined"==typeof this.marker_.getZIndex()?(this.labelDiv_.style.zIndex=parseInt(this.labelDiv_.style.top,10)+e,this.eventDiv_.style.zIndex=this.labelDiv_.style.zIndex):(this.labelDiv_.style.zIndex=this.marker_.getZIndex()+e,this.eventDiv_.style.zIndex=this.labelDiv_.style.zIndex)},MarkerLabel_.prototype.setVisible=function(){this.marker_.get("labelVisible")?this.labelDiv_.style.display=this.marker_.getVisible()?"block":"none":this.labelDiv_.style.display="none",this.eventDiv_.style.display=this.labelDiv_.style.display;var e=this.marker_.get("initCallback");e(this.labelDiv_)},inherits(MarkerWithLabel,google.maps.Marker),MarkerWithLabel.prototype.setMap=function(e){google.maps.Marker.prototype.setMap.apply(this,arguments),this.label.setMap(e)};

$(function () {
  window.vars.$.maps = $('#maps');
  window.vars.$.send = $('#send');
  window.vars.$.myMessage = $('#my_message');
  window.vars.$.zoomIn = $('#zoom_in');
  window.vars.$.zoomOut = $('#zoom_out');
  window.vars.$.plus = $('#plus');
  window.vars.$.facebook = $('#facebook');
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
  window.vars.$.myLocation = $('#my_location');
  window.vars.$.firebaseError = $('#firebase_error');
  window.vars.$.notification = $('#notification');
  window.vars.$.see_comments = $('#see_comments');
  window.vars.$.comments = $('#comments');

  window.vars.$.markerMenu = $('#marker_menu');

  window.vars.hasOpenGeo = false;
  window.vars.content = '';
  window.vars.name = '遊客';
  window.vars.src = 'img/user.png';
  window.vars.hasAudio = false;
  window.vars.lat = null;
  window.vars.lng = null;

  window.vars.points = {};
  window.vars.z = 0;
  window.vars.audio = {
    pop: new Audio('pop.mp3'),
    chat: new Audio('chat.mp3')
  };

  window.vars.$.popbox.find ('.cover, .cancel').click (function () { window.vars.$.popbox.removeClass ('show'); });
  
  window.funcs.updateTitle = function (data) { window.vars.$.title.text ('' + Object.keys (window.vars.points).length + ' 位使用者在地圖上 - LiveMaps'); };
  window.funcs.renderUser = function (obj, content) { return $('<div />').addClass ('user').append ($('<div />').addClass ('avatar').append ($('<img />').attr ('alt', obj.name).attr ('src', obj.src)).imgLiquid ({verticalAlign: 'center'})).append ($('<div />').addClass ('content').text (content = typeof content == 'undefined' ? '' : content)).html (); };
  window.funcs.getPixelPosition = function (obj) { var scale = Math.pow (2, obj.map.getZoom ()), nw = new google.maps.LatLng (obj.map.getBounds ().getNorthEast ().lat (), obj.map.getBounds ().getSouthWest ().lng ()), worldCoordinateNW = obj.map.getProjection ().fromLatLngToPoint (nw), worldCoordinate = obj.map.getProjection ().fromLatLngToPoint (obj.getPosition ()); return new google.maps.Point ((worldCoordinate.x - worldCoordinateNW.x) * scale, (worldCoordinate.y - worldCoordinateNW.y) * scale); };
  window.funcs.showForm = function () { window.vars.$.plus.toggleClass ('open'); if (window.vars.$.plus.hasClass ('open')) window.vars.myMessageTimer =  setTimeout (function () { window.vars.$.myMessage.focus (); }, 500); else clearTimeout (window.vars.myMessageTimer); };
  window.funcs.getFbData = function (cb) { FB.api('/me', function (response) { window.storages.user.set ({ fbuid: response.id, name: response.name, src: 'https://graph.facebook.com/' + response.id + '/picture?width=100&height=100' }); window.funcs.removeSameUser (response.id); return cb && cb (response); }); };
  window.funcs.checkLoginState = function (cb, eb) { FB.getLoginStatus (function (response) { if (response.status != 'connected') return window.storages.user.set (null) && eb && eb (); return cb && cb (response); }); return eb && eb (); };
  window.funcs.initFB = function () { if (!window.storages.user.get ()) window.funcs.checkLoginState (function () { window.funcs.getFbData (); }, function () { window.vars.$.facebook.click (function () { window.vars.$.loading.addClass ('show').find ('.txt').text ('登入中，請稍候..'); FB.login (function (response) { if (response.status != 'connected') return window.vars.$.loading.removeClass ('show') && window.vars.$.facebook.prev ().text ('登入失敗..'); window.funcs.getFbData (function () { window.vars.$.loading.removeClass ('show'); window.vars.$.facebook.parents ('.popbox').removeClass ('show'); window.funcs.showForm (); }); }, {scope: 'public_profile,email'}); }); }); };

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
          $('<span />').text (t.content.slice (0, 255))).append (
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
      if (window.vars.lat === null && window.vars.lng === null) window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get ()).set ({ uid: window.storages.uuid.get (), name: window.storages.user.get () ? window.storages.user.get ().name : window.vars.name, src: window.storages.user.get () ? window.storages.user.get ().src : window.vars.src, enable: 1, fbuid: window.storages.user.get () ? window.storages.user.get ().fbuid : 0, location: { lat: position.coords.latitude, lng: position.coords.longitude}, time: new Date ().getTime () });
      else window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/location').set ({ lat: position.coords.latitude, lng: position.coords.longitude });

      if (window.vars.lat === null && window.vars.lng === null) cb && cb ();

      window.vars.lat = position.coords.latitude;
      window.vars.lng = position.coords.longitude;

      if (window.storages.inited.get () == 'no') window.vars.maps.setOptions ({ zoom: 16, center: new google.maps.LatLng (window.vars.lat, window.vars.lng)});
      return window.vars.$.loading.removeClass ('show') && window.storages.inited.set ('yes');
    }, function () {
      return window.vars.$.loading.removeClass ('show') && window.storages.inited.set ('yes') && cb && cb ();
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
      message: window.vars.firebaseDB.ref ('messages/' + data.uid + '/').limitToLast (1).on ('value', function (snapshot) {
        var msg = null; for (var i in snapshot.val ()) msg = snapshot.val ()[i]; if (!msg) return ;
        window.vars.points[data.uid].marker.setOptions ({ zIndex: ++window.vars.z, labelContent: window.funcs.renderUser (window.vars.points[data.uid].data, msg.content.slice (0, 255)) });
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
      window.vars.$.loading.addClass ('show').find ('.txt').text ('初始中，請稍候..');
      window.funcs.initGeoFeature (cb);
    });
  };

  window.funcs.initFirebase ();
  
  google.maps.event.addDomListener (window, 'load', function () {
    var mapsLastPosition = window.storages.mapsLastPosition.get ();
    window.vars.maps = new google.maps.Map (window.vars.$.maps.get (0), { zoom: mapsLastPosition.zoom, center: new google.maps.LatLng (mapsLastPosition.lat, mapsLastPosition.lng)});

    window.vars.maps.mapTypes.set ('style1', new google.maps.StyledMapType ([{featureType: 'all', stylers: [{ visibility: 'on' }]}, {featureType: 'administrative', stylers: [{ visibility: 'simplified' }]}, {featureType: 'landscape', stylers: [{ visibility: 'simplified' }]}, {featureType: 'poi', stylers: [{ visibility: 'simplified' }]}, {featureType: 'road', stylers: [{ visibility: 'simplified' }]}, {featureType: 'road.arterial', stylers: [{ visibility: 'simplified' }]}, {featureType: 'transit', stylers: [{ visibility: 'simplified' }]}, {featureType: 'water', stylers: [{ color: '#b3d1ff', visibility: 'simplified' }]}, {elementType: "labels.icon", stylers:[{ visibility: 'off' }]}]));
    window.vars.maps.setMapTypeId ('style1');
    window.vars.maps.addListener ('idle', function () { window.storages.mapsLastPosition.set ({zoom: window.vars.maps.zoom, lat: window.vars.maps.center.lat (), lng: window.vars.maps.center.lng ()}); });

    window.vars.firebaseUserRef.orderByChild ('enable').equalTo (1).on ('child_added', window.funcs.appendUser);
    window.vars.firebaseUserRef.orderByChild ('enable').equalTo (0).on ('child_added', window.funcs.removeUser);
    
    window.funcs.initFB ();
    if (window.storages.user.get ()) window.funcs.removeSameUser (window.storages.user.get ().fbuid);

    window.vars.$.zoomIn.click (function () { window.vars.maps.setZoom (window.vars.maps.zoom + 1); }).addClass ('show');
    window.vars.$.zoomOut.click (function () { window.vars.maps.setZoom (window.vars.maps.zoom - 1); }).addClass ('show');
    window.vars.$.send.click (function () { var val = window.vars.$.myMessage.val ().trim ().slice (0, 255); if (!val.length) return ; window.vars.firebaseDB.ref ('messages/' + window.storages.uuid.get ()).push ({ content: val, time: window.funcs.getDatetime () }); window.vars.$.myMessage.val (''); });
    window.vars.$.relogin.find ('.cover, .ok').click (function () { location.reload (); });
    window.vars.$.myMessage.keyup (function (e) { if (e.keyCode == 13) window.vars.$.send.click (); });
    window.vars.$.history.find ('.ok').click (function () { window.vars.$.history.removeClass ('show').get (0).firebase.ref.off ('value', window.vars.$.history.get (0).firebase.on); });
    window.vars.$.notification.attr ('title', '目前 ' + (window.storages.audio.get () == 'on' ? '開啟' : '關閉')).addClass (window.storages.audio.get () == 'on' ? 'icon-notification_active' : 'icon-notification_off').addClass ('show feature_tip').click (function () { window.storages.audio.set (window.storages.audio.get () == 'on' ? 'off' : 'on'); window.vars.hasAudio = window.storages.audio.get () == 'on' ? true : false; $(this).attr ('title', '目前 ' + (window.storages.audio.get () == 'on' ? '開啟' : '關閉')).attr ('class', window.storages.audio.get () == 'on' ? 'icon-notification_active show feature_tip' : 'icon-notification_off show feature_tip'); });
    window.vars.$.login.find ('.ok').click (function () { window.vars.$.popbox.removeClass ('show'); return window.funcs.showForm (); });
    window.vars.$.see_comments.click (function () { window.vars.$.comments.addClass ('show'); }).addClass ('show');
    window.vars.$.plus.click (function () { window.vars.$.loading.addClass ('show').find ('.txt').text ('定位中，請稍候..'); if (window.vars.lat === null && window.vars.lng === null) { window.vars.$.loading.removeClass ('show'); return window.vars.$.gpson.addClass ('show'); } if (!$(this).hasClass ('open') && !window.storages.user.get ()) { window.vars.$.loading.removeClass ('show'); window.vars.$.login.find ('span').text (''); return window.vars.$.login.addClass ('show'); } window.vars.$.loading.removeClass ('show'); return window.funcs.showForm (); }).addClass ('show');

    var audio = function () { if (window.vars.lat === null && window.vars.lng === null) window.vars.$.myLocation.click (function () { window.vars.maps.setOptions ({ zoom: 16, center: new google.maps.LatLng (window.vars.lat, window.vars.lng)}); }).addClass ('show'); setTimeout (function () { window.vars.hasAudio = window.storages.audio.get (); }, 2000); };
    if (window.storages.inited.get () === 'no') window.funcs.initStep (audio);
    else window.funcs.initGeoFeature (audio);

    setInterval (function () { window.vars.firebaseDB.ref ('users/' + window.storages.uuid.get () + '/time/').set (new Date ().getTime ()); }, 60 * 1000);
  });
});