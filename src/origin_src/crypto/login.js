/**
 * ************************************************************************************************
 *
 * 로그인 스크립트 파일입니다. 이 파일을 임의로 수정 후 발생한 오류에 대해서는 책임지지 않습니다.
 *
 * ************************************************************************************************
 */

var client_calkey = "";

var keyModule = (function () {
  var ec_name = "secp256r1";

  var server_url;

  var ec_q;
  var ec_a;
  var ec_b;
  var ec_gx;
  var ec_gy;
  var ec_n;
  var rng;

  var client_prikey;
  var client_pubkey;

  function fn_set_ec_params() {
    var ec_curve = getSECCurveByName(ec_name);

    ec_q = ec_curve.getCurve().getQ().toString(16);
    ec_a = ec_curve.getCurve().getA().toBigInteger().toString(16);
    ec_b = ec_curve.getCurve().getB().toBigInteger().toString(16);
    ec_gx = ec_curve.getG().getX().toBigInteger().toString(16);
    ec_gy = ec_curve.getG().getY().toBigInteger().toString(16);
    ec_n = ec_curve.getN().toString(16);
  }

  function fn_set_client_prikey() {
    var n = new BigInteger(ec_n, 16);
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(n.bitLength(), rng);
    var rand = r.mod(n1).add(BigInteger.ONE);

    client_prikey = r.toString(16);
  }

  function fn_set_client_pubkey() {
    var curve = get_curve();
    var G = get_G(curve);
    var a = new BigInteger(client_prikey, 16);
    var P = G.multiply(a);

    var pubkey_x = P.getX().toBigInteger().toString(16);
    var pubkey_y = P.getY().toBigInteger().toString(16);

    if (pubkey_x.length < 64) {
      var zlen = 64 - pubkey_x.length;
      for (i = 0; i < zlen; i++) {
        pubkey_x = "0" + pubkey_x;
      }
    }

    if (pubkey_y.length < 64) {
      var zlen = 64 - pubkey_y.length;
      for (i = 0; i < zlen; i++) {
        pubkey_y = "0" + pubkey_y;
      }
    }

    client_pubkey = pubkey_x + pubkey_y;
  }

  function fn_set_client_calkey() {
    // https://nsso.snu.ac.kr/sso/usr/snu/login/init
    $.ajax({
      url: server_url,
      type: "post",
      data: "user_ec_publickey=" + client_pubkey,
      dataType: "json",
      async: false,
      success: function (responseData) {
        var result = responseData.code;

        if (result == "SS0001") {
          var pubkey_x = responseData.svr_qx;
          var pubkey_y = responseData.svr_qy;

          var curve = get_curve();
          var P = new ECPointFp(
            curve,
            curve.fromBigInteger(new BigInteger(pubkey_x, 16)),
            curve.fromBigInteger(new BigInteger(pubkey_y, 16))
          );
          var a = new BigInteger(client_prikey, 16);
          var S = P.multiply(a);

          var calkey_x = S.getX().toBigInteger().toString(16);
          var calkey_y = S.getY().toBigInteger().toString(16);

          if (calkey_x.length < 64) {
            var zlen = 64 - calkey_x.length;
            for (i = 0; i < zlen; i++) {
              calkey_x = "0" + calkey_x;
            }
          }

          if (calkey_y.length < 64) {
            var zlen = 64 - calkey_y.length;
            for (i = 0; i < zlen; i++) {
              calkey_y = "0" + calkey_y;
            }
          }

          client_calkey = calkey_x + calkey_y;
        } else {
          alert(
            "인증 서버 시스템 오류가 발생하였습니다.[" +
              result +
              "]\n\n관리자에게 문의하시기 바랍니다."
          );
        }
      },
      error: function () {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[connect]\n\n관리자에게 문의하시기 바랍니다."
        );
      },
    });
  }

  function get_curve() {
    return new ECCurveFp(
      new BigInteger(ec_q, 16),
      new BigInteger(ec_a, 16),
      new BigInteger(ec_b, 16)
    );
  }

  function get_G(curve) {
    return new ECPointFp(
      curve,
      curve.fromBigInteger(new BigInteger(ec_gx, 16)),
      curve.fromBigInteger(new BigInteger(ec_gy, 16))
    );
  }

  return {
    init: function (url) {
      server_url = url;

      fn_set_ec_params();

      rng = new SecureRandom();

      fn_set_client_prikey();

      if (client_prikey.length == 0) {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[PrivateKey]\n\n관리자에게 문의하시기 바랍니다."
        );
        return;
      }

      fn_set_client_pubkey();

      if (client_pubkey.length == 0) {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[PublicKey]\n\n관리자에게 문의하시기 바랍니다."
        );
        return;
      }

      fn_set_client_calkey();

      if (client_calkey == "" || client_calkey.length == 0) {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[CalculateKey]\n\n관리자에게 문의하시기 바랍니다."
        );
        return;
      }
    },
  };
})();

var loginModule = (function () {
  var server_url;

  var login_type;

  function fn_encrypt_data(data) {
    var passni_key = CryptoJS.enc.Hex.parse(client_calkey.substring(0, 64));
    var passni_iv = CryptoJS.enc.Hex.parse(client_calkey.substring(64, 96));

    var byte_data = CryptoJS.SEED.encrypt(data, passni_key, {
      iv: passni_iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.AnsiX923,
    });

    var encrypt_data = byte_data.ciphertext.toString();

    return encrypt_data;
  }

  function fn_server_request(req_data) {
    var obj_data;

    $.ajax({
      url: server_url,
      type: "post",
      data: req_data,
      dataType: "json",
      async: false,
      success: function (responseData) {
        obj_data = responseData;
      },
      error: function () {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[connect]\n\n관리자에게 문의하시기 바랍니다."
        );
      },
    });

    return obj_data;
  }

  return {
    auth: function (url) {
      var language = getCookie("snuSso.pageLang");

      if (language == "") {
        language =
          window.navigator.userLanguage != null
            ? window.navigator.userLanguage
            : window.navigator.language;
        language = language.toLowerCase() === "ko-kr" || "ko" ? "kor" : "eng";
      }

      var msg_client_calkey =
        "인증 서버 시스템 오류가 발생하였습니다.[CalculateKey]\n\n관리자에게 문의하시기 바랍니다.";
      var msg_id_check = "아이디를 입력하여 주십시요.";
      var msg_pw_check = "비밀번호를 입력하여 주십시요.";

      if (language == "eng") {
        msg_client_calkey =
          "An authentication server system error occurred.[CalculateKey]\n\nPlease contact your administrator.";
        msg_id_check = "Enter your ID.";
        msg_pw_check = "Enter your password.";
      } else {
        msg_client_calkey =
          "인증 서버 시스템 오류가 발생하였습니다.[CalculateKey]\n\n관리자에게 문의하시기 바랍니다.";
        msg_id_check = "아이디를 입력하여 주십시요.";
        msg_pw_check = "비밀번호를 입력하여 주십시요.";
      }

      server_url = url;
      login_type = "id";

      if (client_calkey == "" || client_calkey.length == 0) {
        alert(msg_client_calkey);
        return null;
      }

      var login_id = $.trim($("#login_id").val());
      var login_pwd = $.trim($("#login_pwd").val());

      if (login_id == "") {
        alert(msg_id_check);
        $("#login_id").focus();
        return null;
      }

      if (login_pwd == "") {
        alert(msg_pw_check);
        $("#login_pwd").focus();
        return null;
      }

      var jsonObj = { login_id: login_id, login_pwd: login_pwd };
      var jsonStr = JSON.stringify(jsonObj);

      var user_data = fn_encrypt_data(jsonStr);

      var req_data =
        "user_data=" + user_data + "&login_key=" + $("#login_key").val();

      var obj_data = fn_server_request(req_data);

      return obj_data;
    },

    socialAuth: function (url) {
      server_url = url;
      login_type = "social";

      if (client_calkey == "" || client_calkey.length == 0) {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[CalculateKey]\n\n관리자에게 문의하시기 바랍니다."
        );
        return null;
      }

      // social 인증 진행
      var socialLoginId = $.trim($("#social_login_id").val());
      var socialLoginType = $.trim($("#social_login_type").val());

      // 결과값 비교
      if (socialLoginId == "") {
        alert("로그인 실패");
        return null;
      }

      var jsonObj = {
        social_login_id: socialLoginId,
        social_login_type: socialLoginType,
      };
      var jsonStr = JSON.stringify(jsonObj);

      var user_data = fn_encrypt_data(jsonStr);

      var req_data =
        "user_data=" + user_data + "&login_key=" + $("#login_key").val();

      var obj_data = fn_server_request(req_data);

      return obj_data;
    },

    certAuth: function (url) {
      server_url = url;
      login_type = "cert";

      if (client_calkey == "" || client_calkey.length == 0) {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[CalculateKey]\n\n관리자에게 문의하시기 바랍니다."
        );
        return null;
      }

      //var signedText = $.trim( $('#signedText').val() );
      var aVidMsg = $.trim($("#aVidMsg").val());
      var aSignedMsg = $.trim($("#aSignedMsg").val());

      //if (aVidMsg == '') {
      //alert( '등록된 인증서가 없거나 인증서 검증에 실패하였습니다.' );
      //return null;
      //}

      var jsonObj = { aVidMsg: aVidMsg, aSignedMsg: aSignedMsg };
      var jsonStr = JSON.stringify(jsonObj);

      var user_data = fn_encrypt_data(jsonStr);

      var req_data =
        "user_data=" + user_data + "&login_key=" + $("#login_key").val();

      var obj_data = fn_server_request(req_data);

      return obj_data;
    },

    fidoAuth: function (url, fidoauthtoken) {
      server_url = url;
      login_type = "fido";

      if (client_calkey == "" || client_calkey.length == 0) {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[CalculateKey]\n\n관리자에게 문의하시기 바랍니다."
        );
        return null;
      }

      if (fidoauthtoken == "") {
        alert("지문인증 로그인에 실패하였습니다.");
        return null;
      }

      var fido_login_id = $.trim($("#fido_login_id").val());

      var jsonObj = {
        fido_login_id: fido_login_id,
        fido_authtoken: fidoauthtoken,
      };
      var jsonStr = JSON.stringify(jsonObj);

      var user_data = fn_encrypt_data(jsonStr);

      var req_data =
        "user_data=" + user_data + "&login_key=" + $("#login_key").val();

      var obj_data = fn_server_request(req_data);

      return obj_data;
    },

    message: function (obj_data) {
      var code = obj_data.code;
      var value = "";
      var message = "";

      var cert_message = obj_data.message;
      var cert_rtnmsg = obj_data.rtnMsg;

      var language = getCookie("snuSso.pageLang");

      if (language == "") {
        language =
          window.navigator.userLanguage != null
            ? window.navigator.userLanguage
            : window.navigator.language;
        language = language.toLowerCase() === "ko-kr" || "ko" ? "kor" : "eng";
      }

      if (login_type == "cert") {
        message =
          "등록된 인증서 정보가 존재 하지않습니다.\n\n인증서 등록 후 사용해주시기 바랍니다.";
      } else if (login_type == "fido") {
        message = "지문인증 로그인에 실패하였습니다.";
      } else if (login_type == "social") {
        message =
          "SNS 간편인증 로그인 정보가 등록되지 않았거나 아이디를 찾을 수 없습니다.";
      } else {
        //message = '아이디 또는 비밀번호가 올바르지 않습니다.';
        message =
          "아이디 또는 비밀번호가 올바르지 않습니다.\n\n비밀번호 입력실패 정책에 의해 실패횟수 초과시 계정이 잠기게 됩니다.\n주의하시기 바랍니다.";
      }

      if (code == "SS0004") {
        message =
          "최초 로그인 하여 비밀번호 변경화면으로 이동합니다.\n\n비밀번호를 변경하여 주십시요.";
      } else if (code == "SS0005") {
        if (language == "eng") {
          message =
            "You used password that is no longer valid.\n\nPlease change your password.";
        } else {
          message =
            "초기화된 비밀번호를 사용하여 비밀번호 변경화면으로 이동합니다.\n\n비밀번호를 변경하여 주십시요.";
        }
      } else if (code == "SS0006") {
        message = "휴면 계정 입니다.";
      } else if (code == "SS0007") {
        message =
          "재가입 동의가 필요하여 약관 동의 화면으로 이동합니다.\n\n약관에 동의하여 주십시요.";
      } else if (code == "SS0008") {
        value = obj_data.data;

        if (language == "eng") {
          message =
            "You have been using the same password for too long. Please change your password. ";
        } else {
          message =
            "오래된 비밀번호를 사용하고 있어 비밀번호 변경화면으로 이동합니다.\n\n비밀번호를 변경하여 주십시요.";
        }
      } else if (code == "SS0009") {
        value = obj_data.data;

        if (value == "dupAdminAfter") {
          message =
            "동일한 권한을 소유한 관리자가 접속중입니다.\n\n접속중인 관리자의 접속을 종료하고 계속 진행하시겠습니까?";
        } else if (value == "dupAdminBefore") {
          message =
            "전체 관리자 권한을 소유한 관리자가 접속중입니다.\n\n접속중인 관리자가 로그아웃 후 접속이 가능합니다.";
        } else {
          message =
            "[" +
            value +
            "] IP 에서 접속중인 계정입니다.\n\n이전 접속을 종료하고 계속 진행하시겠습니까?";
        }
      } else if (code == "SS0034") {
        // 블랙리스트
        //message = '접속이 차단되어있습니다.\n\n관리자에게 문의 바랍니다.';
      } else if (code == "EAU001") {
      } else if (code == "EAU002") {
      } else if (code == "EAU003") {
        message =
          "접속 기간이 시작전이거나 만료되었습니다.\n\n관리자에게 문의하시기 바랍니다.";
      } else if (code == "EAU004") {
        message =
          "접속 가능한 아이피 정보가 아닙니다.\n\n관리자에게 문의하시기 바랍니다.";
      } else if (code == "EAU005") {
        message =
          "정상적인 접근 경로가 아닙니다.[" +
          code +
          "]\n\n잠시후 다시 시도하여 주십시요.";
      } else if (code == "EAU006") {
        message =
          "정상적인 접근 경로가 아닙니다.[" +
          code +
          "]\n\n잠시후 다시 시도하여 주십시요.";
      } else if (code == "EAU007") {
        message =
          "정상적인 접근 경로가 아닙니다.[" +
          code +
          "]\n\n잠시후 다시 시도하여 주십시요.";
      } else if (code == "EAU008") {
        value = obj_data.data;
        message =
          "아이디 또는 비밀번호 오류 횟수를 초과하여 " +
          value +
          "분 동안 접속이 불가합니다.\n\n잠시후 다시 시도하여 주십시요.";
      } else if (code == "EAU009") {
        //message = '아이디 또는 비밀번호 오류 횟수를 초과하여 접속이 불가합니다.\n\n관리자에게 문의하시기 바랍니다.';
      } else if (code == "EAU012") {
        value = obj_data.data;
        //message = '아이디 또는 비밀번호 오류 횟수를 초과하여 ' + value + '분 동안 접속이 불가합니다.\n\n잠시후 다시 시도하여 주십시요.';
      } else if (code == "EAU013") {
        message = "세션이 만료되었습니다.";
      } else if (code == "EAU014") {
        message = "인증서가 등록 된 사용자가 없습니다.";
      } else if (code == "EAU020") {
        message = "해외 IP 접속이 차단되어 있습니다.";
      } else if (code == "ECA002") {
        message = "기존 로그인한 사용자와 다른 사용자입니다.";
      } else if (code == "EOP001") {
        message =
          "해당 시스템에 대한 접속 권한이 없습니다.\n\n관리자에게 문의하시기 바랍니다.";
      } else if (code == "ESA001") {
        message =
          "SNS 간편인증 로그인 정보가 등록되지 않았거나 아이디를 찾을 수 없습니다.";
      } else if (code == "ESA005") {
        message =
          "SNS 간편인증 로그인 정보 등록 실패. [" +
          code +
          "]\r\n관리자에게 문의하시기 바랍니다.";
      } else if (code == "72060") {
        message =
          "폐기된 인증서입니다. 인증서를 재발급 하시거나, \n\n이미 받으셨다면 포털에서 인증서를 다시 등록해주세요. [" +
          cert_rtnmsg +
          "]";
      } else {
        if (cert_rtnmsg != "") {
          message =
            "인증서 검증에 실패 하였습니다.[" +
            cert_rtnmsg +
            "] \n\n관리자에게 문의하시기 바랍니다.";
        } else {
          if (cert_message == "" || cert_message == undefined) {
            message =
              "인증 서버 시스템 오류가 발생하였습니다.[" +
              code +
              "]\n\n관리자에게 문의하시기 바랍니다.";
          }
        }
      }

      return message;
    },
  };
})();

var passwordModule = (function () {
  var server_url;

  function fn_encrypt_data(data) {
    var passni_key = CryptoJS.enc.Hex.parse(client_calkey.substring(0, 64));
    var passni_iv = CryptoJS.enc.Hex.parse(client_calkey.substring(64, 96));

    var byte_data = CryptoJS.SEED.encrypt(data, passni_key, {
      iv: passni_iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.AnsiX923,
    });

    var encrypt_data = byte_data.ciphertext.toString();

    return encrypt_data;
  }

  function fn_server_request(req_data) {
    var obj_data;

    $.ajax({
      url: server_url,
      type: "post",
      data: req_data,
      dataType: "json",
      async: false,
      success: function (responseData) {
        obj_data = responseData;
      },
      error: function () {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[connect]\n\n관리자에게 문의하시기 바랍니다."
        );
      },
    });

    return obj_data;
  }

  return {
    change: function (url) {
      server_url = url;

      var pw_current_password = $.trim($("#pw_current_password").val());
      var pw_new_password = $.trim($("#pw_new_password").val());
      var pw_new_password_confirm = $.trim($("#pw_new_password_confirm").val());

      if (client_calkey == "" || client_calkey.length == 0) {
        alert(
          "인증 서버 시스템 오류가 발생하였습니다.[CalculateKey]\n\n관리자에게 문의하시기 바랍니다."
        );
        return null;
      }

      if (pw_current_password == "") {
        alert("현재 비밀번호를 입력하여 주십시요.");
        $("#pw_current_password").focus();
        return null;
      }

      if (pw_new_password == "") {
        alert("새 비밀번호를 입력하여 주십시요.");
        $("#pw_new_password").focus();
        return null;
      }

      if (pw_new_password_confirm == "") {
        alert("새 비밀번호 확인을 입력하여 주십시요.");
        $("#pw_new_password_confirm").focus();
        return null;
      }

      // 관리자 패스워드 정책 체크
      var passwordPolicyCheckResult = PolicyValidator.checkPasswordPolicy(
        "pw_new_password",
        "pw_new_password_confirm",
        "pw_current_password"
      );

      if (!passwordPolicyCheckResult.flag) {
        alert(passwordPolicyCheckResult.message);

        $(this).blur();
        $("#pw_new_password").focus();

        return null;
      }

      //			var specialPattern = /^.*(?=.*[%]).*$/;
      //
      //			if( specialPattern.test( pw_new_password ) || specialPattern.test( pw_new_password_confirm ) ) {
      //				alert("비밀번호에 '%'는 사용할 수 없습니다.");
      //				return null;
      //			}

      $("#pw_current_password").val("");
      $("#pw_new_password").val("");
      $("#pw_new_password_confirm").val("");

      var jsonObj = {
        pw_current_password: pw_current_password,
        pw_new_password: pw_new_password,
      };
      var jsonStr = JSON.stringify(jsonObj);

      var user_data = fn_encrypt_data(jsonStr);

      var req_data =
        "user_data=" + user_data + "&login_key=" + $("#login_key").val();

      // HTTPS://nsso.snu.ac.kr/sso/usr/snu/login/link
      var obj_data = fn_server_request(req_data);

      return obj_data;
    },

    message: function (obj_data) {
      var code = obj_data.code;
      var value = "";
      var message = "";

      var language = getCookie("snuSso.pageLang");

      if (language == "") {
        language =
          window.navigator.userLanguage != null
            ? window.navigator.userLanguage
            : window.navigator.language;
        language = language.toLowerCase() === "ko-kr" || "ko" ? "kor" : "eng";
      }

      if (code == "SS0001") {
        if (language == "eng") {
          message = "Password changed successfully.";
        } else {
          message = "비밀번호가 정상적으로 변경되었습니다.";
        }
      } else if (code == "SS0004") {
        message =
          "최초 로그인 하여 비밀번호 변경화면으로 이동합니다.\n\n비밀번호를 변경하여 주십시요.";
      } else if (code == "SS0005") {
        if (language == "eng") {
          message =
            "You used password that is no longer valid.\n\nPlease change your password.";
        } else {
          message =
            "초기화된 비밀번호를 사용하여 비밀번호 변경화면으로 이동합니다.\n\n비밀번호를 변경하여 주십시요.";
        }
      } else if (code == "SS0006") {
        message = "휴면 계정 입니다.";
      } else if (code == "SS0007") {
        message =
          "재가입 동의가 필요하여 약관 동의 화면으로 이동합니다.\n\n약관에 동의하여 주십시요.";
      } else if (code == "SS0008") {
        value = obj_data.data;

        if (language == "eng") {
          message =
            "You have been using the same password for too long. Please change your password. ";
        } else {
          message =
            "오래된 비밀번호를 사용하고 있어 비밀번호 변경화면으로 이동합니다.\n\n비밀번호를 변경하여 주십시요.";
        }
      } else if (code == "SS0009") {
        value = obj_data.data;

        if (value == "dupAdminAfter") {
          message =
            "비밀번호가 정상적으로 변경되었습니다.\n\n동일한 권한을 소유한 관리자가 접속중입니다.\n\n접속중인 관리자의 접속을 종료하고 계속 진행하시겠습니까?";
        } else if (value == "dupAdminBefore") {
          message =
            "비밀번호가 정상적으로 변경되었습니다.\n\n전체 관리자 권한을 소유한 관리자가 접속중입니다.\n\n접속중인 관리자가 로그아웃 후 접속이 가능합니다.";
        } else {
          message =
            "비밀번호가 정상적으로 변경되었습니다.\n\n[" +
            value +
            "] IP 에서 접속중인 계정입니다.\n\n이전 접속을 종료하고 계속 진행하시겠습니까?";
        }
      } else if (code == "EAU005") {
        message =
          "정상적인 접근 경로가 아닙니다.[" +
          code +
          "]\n\n잠시후 다시 시도하여 주십시요.";
      } else if (code == "EAU006") {
        message =
          "정상적인 접근 경로가 아닙니다.[" +
          code +
          "]\n\n로그인 화면으로 이동합니다.";
      } else if (code == "EAU010") {
        message = "사용자 정보가 조회되지 않아 비밀번호 변경에 실패하였습니다.";
      } else if (code == "EAU011") {
        if (language == "eng") {
          message = "Passwords do not match.";
        } else {
          message = "현재 비밀번호가 일치하지 않습니다.";
        }
      } else {
        message =
          "인증 서버 시스템 오류가 발생하였습니다.[" +
          code +
          "]\n\n관리자에게 문의하시기 바랍니다.";
      }

      return message;
    },
  };
})();
