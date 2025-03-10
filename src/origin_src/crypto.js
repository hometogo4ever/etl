import pkg from "elliptic";
const { ec: EC } = pkg;
import { randomBytes } from "crypto";
import BN from "bn.js";

const ecName = "secp256k1";
const ec = new EC(ecName);
const curve = ec.curve;

// 곡선 파라미터 설정
function setEcParams() {
  return {
    q: curve.Q.toString(16),
    a: curve.a.toString(16),
    b: curve.b.toString(16),
    gx: curve.g.x.toString(16),
    gy: curve.g.y.toString(16),
    n: curve.n.toString(16),
  };
}

const ecParams = setEcParams();

// 클라이언트 개인키 생성
function setClientPrivateKey() {
  const n = new BN(ecParams.n, 16);
  const n1 = n.sub(new BN(1));
  const r = new BN(randomBytes(n.byteLength()));
  const rand = r.mod(n1).add(new BN(1));
  return rand.toString(16);
}

const clientPrivateKey = setClientPrivateKey();

// 클라이언트 공개키 생성 (기존 `fn_set_client_pubkey` 대체)
function setClientPublicKey(privateKeyHex) {
  const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
  const pubPoint = keyPair.getPublic();

  let pubkeyX = pubPoint.getX().toString(16).padStart(64, "0");
  let pubkeyY = pubPoint.getY().toString(16).padStart(64, "0");

  return pubkeyX + pubkeyY;
}

const clientPublicKey = setClientPublicKey(clientPrivateKey);

console.log("Private Key:", clientPrivateKey);
console.log("Public Key:", clientPublicKey);
