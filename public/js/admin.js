/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 * @website     http://www.ioa.tw/
 */

$(function () {
  window.vars.onlineCounter = 0;
  window.vars.users = {};
  window.vars.$.users = $('#users');
  window.vars.$.onlineCounter = $('#online_counter');

  window.vars.$.time = $('#time');
  window.vars.$.timeago = $('#timeago');
  window.vars.$.clearCounter = $('#clear_counter');
  window.vars.rangeMin = 1.5;
  
  var appendUser = function (snapshot) {
    var data = null; if (!(snapshot && (data = snapshot.val ()) && (typeof data.uid != 'undefined') && (data.uid.length > 0) && (typeof data.name != 'undefined') && (data.name.length > 0) && (typeof data.src != 'undefined') && (data.src.length > 0) && (typeof data.enable != 'undefined') && (data.enable != 0) && (typeof data.location != 'undefined') && (Object.keys (data.location).length == 2) && (typeof data.location.lat != 'undefined') && (data.location.lat >= -90 ) && (data.location.lat <= 90 ) && (typeof data.location.lng != 'undefined') && (data.location.lng >= -180) && (data.location.lng <= 180) && (typeof window.vars.users[data.uid] == 'undefined'))) return ;

    var $user = $('<div />').addClass ('user').append ($('<div />').addClass ('avatar').attr ('title', data.name).append ($('<img />').attr ('src', data.src)).imgLiquid ({verticalAlign: 'center'})).append ($('<div />').addClass ('msg'));
    var ref = window.vars.firebaseDB.ref ('messages/' + data.uid);
    var on = ref.limitToLast (1).on ('value', function (snapshot) { var t = null; for (var i in snapshot.val ()) t = snapshot.val ()[i]; window.vars.users[data.uid].$user.find ('.msg').text (t ? data.name + ': ' + t.content.slice (0, 255) : '').attr ('title', t ? $.timeago (t.time) : ''); });

    window.vars.users[data.uid] = {
      $user: $user,
      ref: ref,
      on: on,
    };

    window.vars.$.users.append (window.vars.users[data.uid].$user);
    window.vars.$.onlineCounter.text (++window.vars.onlineCounter);
  };
  var removeUser = function (snapshot) {
    var data = null; if (!(snapshot && (data = snapshot.val ()) && (typeof data.uid != 'undefined') && (data.uid.length > 0) && (typeof window.vars.users[data.uid] != 'undefined'))) return ;

    window.vars.users[data.uid].ref.off ('value', window.vars.users[data.uid].on);
    window.vars.users[data.uid].$user.remove ();
    delete window.vars.users[data.uid];
    window.vars.$.onlineCounter.text (--window.vars.onlineCounter);
  };

  window.funcs.initFirebase ();
  window.vars.firebaseUserRef.orderByChild ('enable').equalTo (1).on ('child_added', appendUser);
  window.vars.firebaseUserRef.orderByChild ('enable').equalTo (0).on ('child_added', removeUser);
    
  window.vars.$.loading.removeClass ('show');
  var timer = function () {


    window.vars.firebaseUserRef.orderByChild ('enable').equalTo (1).once ('value', function (snapshot) {
      var datas = []; for (var i in snapshot.val ()) if (snapshot.val ()[i].time < new Date ().getTime () - window.vars.rangeMin * 60 * 1000) datas.push (snapshot.val ()[i]);
      datas.forEach (function (t) { window.vars.firebaseDB.ref ('users/' + t.uid + '/enable/').set (0); });
      var datetime = window.funcs.getDatetime ();
      window.vars.$.time.text (datetime);
      window.vars.$.timeago.text ($.timeago (datetime));
      window.vars.$.clearCounter.text (datas.length);
    });
  };
  timer ();
  setInterval (timer, 2 * 60 * 1000);

});