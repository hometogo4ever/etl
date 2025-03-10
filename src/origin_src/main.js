import { randomBytes } from "crypto";
import pkg from "elliptic";
import BN from "bn.js";
const { ec: EC } = pkg;

// 사용 가능한 ECC Curve: "p192", "p224", "p256", "p384", "p521", "secp256k1"
const ecName = "secp256k1";
const ec = new EC(ecName);

// 곡선 파라미터 설정
function setEcParams() {
  const curve = ec.curve;
  return {
    q: curve.p.toString(16),
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
  const r = new BN(randomBytes(n.byteLength())); // 안전한 랜덤 값 생성
  const rand = r.mod(n1).add(new BN(1)); // 1 <= rand < n
  return rand.toString(16); // 'rand'를 반환해야 함
}

const clientPrivateKey = setClientPrivateKey();

// 클라이언트 공개키 생성
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
