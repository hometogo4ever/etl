import CryptoJS from "./crypto/seed.js";

var client_calkey =
  "1315a6cdd05078a4b8a076ecab88d03516a63dbc6b38e16e79f19b69bdd059fe175da073edab3ed824bc957a7cffeaba139d84858c5a88833474eb16518644fa";

console.log(client_calkey.length);
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

function fn_generate_auth(login_id, login_pwd, login_key) {
  var jsonObj = { login_id: login_id, login_pwd: login_pwd };
  var jsonStr = JSON.stringify(jsonObj);

  var user_data = fn_encrypt_data(jsonStr);

  var req_data = "user_data=" + user_data + "&login_key=" + login_key;

  return req_data;
}

var login_id = "hometogo0625";
var login_pwd = "sessy5295!!";
var login_key = "D708A13D546D6719FE4DC2188C387FA5";

var req_data = fn_generate_auth(login_id, login_pwd, login_key);
console.log(req_data);
