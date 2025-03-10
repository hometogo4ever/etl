(function (e) {
  var t = {};
  function n(r) {
    if (t[r]) {
      return t[r].exports;
    }
    var o = (t[r] = { i: r, l: false, exports: {} });
    e[r].call(o.exports, o, o.exports, n);
    o.l = true;
    return o.exports;
  }
  n.m = e;
  n.c = t;
  n.d = function (e, t, r) {
    if (!n.o(e, t)) {
      Object.defineProperty(e, t, {
        configurable: false,
        enumerable: true,
        get: r,
      });
    }
  };
  n.n = function (e) {
    var t =
      e && e.__esModule
        ? function t() {
            return e["default"];
          }
        : function t() {
            return e;
          };
    n.d(t, "a", t);
    return t;
  };
  n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  };
  n.p = "/learningx/";
  return n((n.s = 2030));
})({
  2030: function (e, t, n) {
    e.exports = n(2031);
  },
  2031: function (e, t, n) {
    "use strict";
    window.loginCryption = function (e, t) {
      var n = new JSEncrypt();
      n.setPrivateKey(t);
      var r = n.decrypt(e);
      document.getElementById("pseudonym_session_password").value = r;
      document.getElementById("login_form").submit();
    };
  },
});
