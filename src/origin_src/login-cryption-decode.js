(function (moduleMap) {
  // 모듈 캐시 객체
  var moduleCache = {};

  // 웹팩이 제공하는 require 함수
  function webpackRequire(moduleId) {
    // 캐시에 해당 모듈이 있으면 즉시 반환
    if (moduleCache[moduleId]) {
      return moduleCache[moduleId].exports;
    }
    // 새 모듈 객체 생성
    var newModule = (moduleCache[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
    // 모듈 함수를 호출하여 exports 채우기
    moduleMap[moduleId].call(
      newModule.exports,
      newModule,
      newModule.exports,
      webpackRequire
    );
    newModule.l = true;
    return newModule.exports;
  }

  // 몇 가지 속성(헬퍼 함수들)을 웹팩 require에 설정
  webpackRequire.m = moduleMap;
  webpackRequire.c = moduleCache;
  webpackRequire.d = function (exportsObj, name, getter) {
    if (!webpackRequire.o(exportsObj, name)) {
      Object.defineProperty(exportsObj, name, {
        configurable: false,
        enumerable: true,
        get: getter,
      });
    }
  };
  webpackRequire.n = function (moduleObj) {
    var getter =
      moduleObj && moduleObj.__esModule
        ? function getDefault() {
            return moduleObj["default"];
          }
        : function getModuleExports() {
            return moduleObj;
          };
    webpackRequire.d(getter, "a", getter);
    return getter;
  };
  webpackRequire.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  webpackRequire.p = "/learningx/";

  // 2030 모듈(엔트리)을 실행
  return webpackRequire((webpackRequire.s = 2030));
})({
  // 2030 모듈: 단순히 2031 모듈을 가져와서 exports 함
  2030: function (module, exports, webpackRequire) {
    module.exports = webpackRequire(2031);
  },

  // 2031 모듈: 핵심 로직 (로그인 폼 비밀번호 복호화 후 제출)
  2031: function (module, exports, webpackRequire) {
    "use strict";

    window.loginCryption = function (encryptedStr, privateKeyStr) {
      var jsencryptInstance = new JSEncrypt();
      jsencryptInstance.setPrivateKey(privateKeyStr);
      var decryptedPassword = jsencryptInstance.decrypt(encryptedStr);

      document.getElementById("pseudonym_session_password").value =
        decryptedPassword;
      document.getElementById("login_form").submit();
    };
  },
});
