// filename: generateKeys.js
import { BigInteger, SecureRandom } from "jsbn";
import pkg from "ecc-jsbn";
const { ECCurves } = pkg;
import { ECCurveFp, ECPointFp } from "ecc-jsbn/lib/ec.js";
import CryptoJS from "../../origin_src/crypto/seed.js";
import readline from "readline";
import JSEncrypt from "node-jsencrypt";
import AxiosInstance from "./AxiosInstance.js";

class LoginAuth {
  constructor() {
    const ec_curve = ECCurves.secp256r1();
    const curve = ec_curve.getCurve();

    // curve 파라미터 추출
    this.ec_q = curve.getQ().toString(16);
    this.ec_a = curve.getA().toBigInteger().toString(16);
    this.ec_b = curve.getB().toBigInteger().toString(16);
    this.ec_gx = ec_curve.getG().getX().toBigInteger().toString(16);
    this.ec_gy = ec_curve.getG().getY().toBigInteger().toString(16);
    this.ec_n = ec_curve.getN().toString(16);
    this.rng = new SecureRandom();
    this.axiosInstance = AxiosInstance.getInstance();
  }

  generatePrivateKey() {
    // n = 곡선 차수
    let n = new BigInteger(this.ec_n, 16);
    let n1 = n.subtract(BigInteger.ONE);

    // n.bitLength() 의 랜덤 비트 => r
    let r = new BigInteger(n.bitLength(), this.rng);
    // r을 (n-1)로 나눈 나머지 + 1 => 실제 올바른 범위 값
    let rand = r.mod(n1).add(BigInteger.ONE);

    // (원본 코드 동일) 결국 r.toString(16)을 비밀키로 사용
    this.client_prikey = r.toString(16);
  }

  generatePublicKey() {
    let curve = this.get_curve();
    let G = this.get_G(curve);

    // private key를 BigInteger화
    let a = new BigInteger(this.client_prikey, 16);
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

    this.client_pubkey = pubkey_x + pubkey_y;
  }

  generateClientCalKey(pubkey_x, pubkey_y) {
    var curve = this.get_curve();
    var P = new ECPointFp(
      curve,
      curve.fromBigInteger(new BigInteger(pubkey_x, 16)),
      curve.fromBigInteger(new BigInteger(pubkey_y, 16))
    );
    var a = new BigInteger(this.client_prikey, 16);
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

    this.client_calkey = calkey_x + calkey_y;
  }

  generateAuth(login_id, login_pwd, login_key) {
    var jsonObj = { login_id: login_id, login_pwd: login_pwd };
    var jsonStr = JSON.stringify(jsonObj);

    var user_data = this.encrypt_data(jsonStr);

    var req_data = "user_data=" + user_data + "&login_key=" + login_key;

    return req_data;
  }

  encrypt_data(data) {
    var passni_key = CryptoJS.enc.Hex.parse(
      this.client_calkey.substring(0, 64)
    );
    var passni_iv = CryptoJS.enc.Hex.parse(
      this.client_calkey.substring(64, 96)
    );

    var byte_data = CryptoJS.SEED.encrypt(data, passni_key, {
      iv: passni_iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.AnsiX923,
    });

    var encrypt_data = byte_data.ciphertext.toString();

    return encrypt_data;
  }

  get_curve() {
    return new ECCurveFp(
      new BigInteger(this.ec_q, 16),
      new BigInteger(this.ec_a, 16),
      new BigInteger(this.ec_b, 16)
    );
  }

  get_G(curve) {
    return new ECPointFp(
      curve,
      curve.fromBigInteger(new BigInteger(this.ec_gx, 16)),
      curve.fromBigInteger(new BigInteger(this.ec_gy, 16))
    );
  }

  loginCryption(encryptedData, privateKey) {
    var n = new JSEncrypt();
    n.setPrivateKey(privateKey);
    var r = n.decrypt(encryptedData);
    return r;
  }

  async action() {
    if (!this.client_pubkey) {
      return Promise.reject("Public Key is not generated");
    }
    const { agt_id, agt_url, agt_r } = await this.axiosInstance.initialBegin();
    const login_key = await this.axiosInstance.initialLing(
      agt_id,
      agt_url,
      agt_r
    );
    const { svr_qx, svr_qy } = await this.axiosInstance.initKey(
      this.client_pubkey
    );
    this.generateClientCalKey(svr_qx, svr_qy);

    const req_data = this.generateAuth(
      "hometogo0625",
      "sessy5295!!",
      login_key
    );
    const data = await this.axiosInstance.auth(req_data);
    this.client_id = data.snu_member_key;
    const msgSend = await this.axiosInstance.sendAuthMSG("sms", login_key);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the verification code: ", async (crt_no) => {
      try {
        console.log("Verification Code:", crt_no);
        const verifyResponse = await this.axiosInstance.verifyMSG(
          crt_no,
          login_key
        );
        console.log("Verification Response:", verifyResponse);
        const { param1, param2 } = await this.axiosInstance.getPNI(login_key);
        const newpw = this.loginCryption(param1, param2);
        console.log("Encrypted Password:", param1);
        console.log("RSA Private Key:", param2);

        console.log("User Id:", this.client_id);
        console.log("New Password:", newpw);
        //await this.axiosInstance.loginCanvas(this.client_id, newpw);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        rl.close();
      }
    });
  }
}

const auth = new LoginAuth();
auth.generatePrivateKey();
auth.generatePublicKey();
auth.action();
