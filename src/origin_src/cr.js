// filename: generateKeys.js
import { BigInteger, SecureRandom } from "jsbn";
import pkg from "ecc-jsbn";
const { ECCurves } = pkg;
import { ECCurveFp, ECPointFp } from "ecc-jsbn/lib/ec.js";
import { get } from "http";

////////////////////////////////////
// 1. 전역/유틸 함수
////////////////////////////////////

let ec_q;
let ec_a;
let ec_b;
let ec_gx;
let ec_gy;
let ec_n;
let rng; // SecureRandom 인스턴스

let client_prikey;
let client_pubkey;

function fn_set_ec_params() {
  // ecc-jsbn 에서 제공하는 getSECCurveByName 사용
  const ec_curve = ECCurves.secp256r1();
  const curve = ec_curve.getCurve();

  // curve 파라미터 추출
  ec_q = curve.getQ().toString(16);
  ec_a = curve.getA().toBigInteger().toString(16);
  ec_b = curve.getB().toBigInteger().toString(16);
  ec_gx = ec_curve.getG().getX().toBigInteger().toString(16);
  ec_gy = ec_curve.getG().getY().toBigInteger().toString(16);
  ec_n = ec_curve.getN().toString(16);
}

function fn_set_client_prikey() {
  // n = 곡선 차수
  let n = new BigInteger(ec_n, 16);
  let n1 = n.subtract(BigInteger.ONE);

  // n.bitLength() 의 랜덤 비트 => r
  let r = new BigInteger(n.bitLength(), rng);
  // r을 (n-1)로 나눈 나머지 + 1 => 실제 올바른 범위 값
  let rand = r.mod(n1).add(BigInteger.ONE);

  // (원본 코드 동일) 결국 r.toString(16)을 비밀키로 사용
  client_prikey = r.toString(16);
}

function fn_set_client_pubkey() {
  let curve = get_curve();
  console.log("curve:", curve);
  let G = get_G(curve);
  console.log("G:", G);

  // private key를 BigInteger화
  let a = new BigInteger(client_prikey, 16);
  let P = G.multiply(a);

  // X, Y 좌표를 16진수로 얻음
  let pubkey_x = P.getX().toBigInteger().toString(16);
  let pubkey_y = P.getY().toBigInteger().toString(16);

  // 64자리가 되도록 0 패딩
  if (pubkey_x.length < 64) {
    pubkey_x = pubkey_x.padStart(64, "0");
  }
  if (pubkey_y.length < 64) {
    pubkey_y = pubkey_y.padStart(64, "0");
  }

  client_pubkey = pubkey_x + pubkey_y;
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

////////////////////////////////////
// 2. 실행부
////////////////////////////////////
function generateKeyPair() {
  // 랜덤 시드 초기화
  rng = new SecureRandom();

  // 곡선 파라미터 설정
  fn_set_ec_params();

  // 비밀키 생성
  fn_set_client_prikey();

  // 공개키 생성
  fn_set_client_pubkey();

  return {
    privateKey: client_prikey,
    publicKey: client_pubkey,
  };
}

var pubkey_x =
  "EFC89243B6645E8C73E048DC7C415BF6B48344DA299838BC86FE9EF93CD969DF";
var pubkey_y =
  "0C85CB9B5706608DF7D3D68F8EAA7E9AEFBF62AF40A9BEE9F3B112F558502284";

function get_client_calkey(pubkey_x, pubkey_y, client_prikey) {
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

  var client_calkey = calkey_x + calkey_y;
  return client_calkey;
}

fn_set_ec_params();
console.log(
  get_client_calkey(
    pubkey_x,
    pubkey_y,
    "448f301c500c396248dbc456958e3a3c0a8ba9eaedbc0e4d9dad25b28e5c6cb2"
  )
);

function authNoSend() {
  var auth_methods = $("#auth_methods").val();

  var mail = $("#mail").val();
  var sms = $("#sms").val();

  if (auth_methods == "sms") {
    if (sms != "") {
      authNosendChk = true;
    } else {
      alert(CommonLang.getMessage("no.sms.number"));
    }
  } else if (auth_methods == "mail") {
    if (mail != "") {
      authNosendChk = true;
    } else {
      alert(CommonLang.getMessage("no.email.address"));
    }
  }

  if (authNosendChk == true) {
    $.ajax({
      url: "/sso/usr/snu/mfa/login/ajaxUserSend",
      type: "post",
      data: { crtfc_type: auth_methods, login_key: $("#login_key").val() },
      dataType: "json",
      async: false,
      success: function (response_data) {
        if (response_data.result) {
          alert(CommonLang.getMessage("send.crtfc_no.msg"));

          $("#id_crtfc_no").focus();

          if (_countdownFlag) {
            Countdown.init();
          } else {
            _countdownFlag = true;

            Countdown.start(
              3,
              function () {
                alert(CommonLang.getMessage("time.expired.msg"));

                $("#id_crtfc_no").val("");

                _countdownFlag = false;
                Countdown.stop("id_countdown", "N");

                $("#popup3").fadeOut();
                $(".bg_overlay").fadeOut();

                $("#info_null").hide();
              },
              "id_countdown",
              "N"
            );
          }
        } else {
          alert(CommonLang.getMessage("send.error", response_data.error_code));
        }
      },
      error: function (xhr, status, error) {
        console.log("error:" + error);
      },
    });
  }
}

function fnUserAuthId() {
  var crtfc_no = $("#id_crtfc_no").val();

  if (authNosendChk == false) {
    alert(CommonLang.getMessage("no.send.crtfc_no"));
    return;
  }

  if (crtfc_no == "") {
    alert(CommonLang.getMessage("input.crtfc_no.empty.msg"));
    $("#id_crtfc_no").focus();
    return;
  }

  //이 브라우저에서 추가 인증 사용 안함 체크
  var bypass_check = $("#bypass_check").is(":checked");

  $.ajax({
    url: "/sso/usr/snu/mfa/login/ajaxUserAuthId",
    type: "post",
    data: {
      crtfc_no: crtfc_no,
      login_key: $("#login_key").val(),
      bypass_check: bypass_check,
    },
    dataType: "json",
    async: false,
    success: function (response_data) {
      if (response_data.result) {
        //카운트 다운 정지
        Countdown.stop("id_countdown", "N");

        //레이어 fade out
        $("#popup3").fadeOut();
        $(".bg_overlay").fadeOut();

        //마지막 로그인 타입 지정
        setCookie("smlt", "id", "30");

        var message = loginModule.message(response_data);

        //추가 인증 완료 후 loginProc에서 저장해 둔 code 및 message에 따라 처리
        if (response_data.code == "SS0001" || response_data.code == "SS0004") {
          $("form[name=loginForm]").attr("action", sesUrl).submit();
        } else if (response_data.code == "SS0009") {
          if (confirm(message)) {
            $("form[name=loginForm]").attr("action", sesUrl).submit();
          } else {
            Countdown.stop("id_countdown", "N");

            $("#popup3").fadeOut();
            $(".bg_overlay").fadeOut();

            $("#info_null").hide();

            $("#login_id").focus();
          }
        } else if (
          response_data.code == "SS0005" ||
          response_data.code == "SS0008"
        ) {
          alert(message);
          $("#pwd_type").val(response_data.code);
          $("form[name=loginForm]")
            .attr("action", "/sso/usr/snu/login/password/view")
            .submit();
        } else if (response_data.code == "SS0034") {
          $("#blUserId").val($("#login_id").val());
          $("#blLoginDe").val(response_data.loginDe);

          $("form[name=BlackListForm]")
            .attr("action", "/sso/usr/snu/login/blackListView")
            .submit();
        } else if (response_data.code == "SS0006") {
          // 휴면계정
          $("#saUserId").val($("#login_id").val());
          $("form[name=SleeperAccntForm]")
            .attr("action", "/sso/usr/self/sleeperAccnt")
            .submit();
        }
      } else {
        if (response_data.code == "EMF002") {
          alert(CommonLang.getMessage("input.crtfc_no.incorrect.msg"));

          $("#id_crtfc_no").val("");
          $("#id_crtfc_no").focus();
        } else if (response_data.code == "EMF005") {
          alert(CommonLang.getMessage("error.EMF005"));
        } else if (response_data.code == "EMF006") {
          alert(CommonLang.getMessage("error.EMF006"));
        } else if (response_data.code == "EMF007") {
          alert(CommonLang.getMessage("error.EMF007"));
        } else if (response_data.code == "EMF027") {
          alert(CommonLang.getMessage("time.expired.msg"));
        } else if (response_data.code == "EAU006") {
          alert(CommonLang.getMessage("error.request", response_data.code));
        } else {
          alert(CommonLang.getMessage("error.system", response_data.code));
        }

        if (response_data.code != "EMF002") {
          $("#id_crtfc_no").val("");

          _countdownFlag = false;
          Countdown.stop("id_countdown", "N");

          $("#popup3").fadeOut();
          $(".bg_overlay").fadeOut();

          $("#info_null").hide();
        }
      }
    },
    error: function (xhr, status, error) {
      console.log("error:" + error);
    },
  });
}
