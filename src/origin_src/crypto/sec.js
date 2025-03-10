// Named EC curves

// Requires ec.js, jsbn.js, and jsbn2.js

// ----------------
// X9ECParameters

// constructor
function X9ECParameters(curve, g, n, h) {
  this.curve = curve;
  this.g = g;
  this.n = n;
  this.h = h;
}

function x9getCurve() {
  return this.curve;
}

function x9getG() {
  return this.g;
}

function x9getN() {
  return this.n;
}

function x9getH() {
  return this.h;
}

X9ECParameters.prototype.getCurve = x9getCurve;
X9ECParameters.prototype.getG = x9getG;
X9ECParameters.prototype.getN = x9getN;
X9ECParameters.prototype.getH = x9getH;

// ----------------
// SECNamedCurves

function fromHex(s) {
  return new BigInteger(s, 16);
}

function secp224r1() {
  // p = 2^224 - 2^96 + 1
  var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001");
  var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE");
  var b = fromHex("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4");
  //byte[] S = Hex.decode("BD71344799D5C7FCDC45B59FA3B9AB8F6A948BC5");
  var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D");
  var h = BigInteger.ONE;
  var curve = new ECCurveFp(p, a, b);
  var G = curve.decodePointHex(
    "04" +
      "B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21" +
      "BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34"
  );
  return new X9ECParameters(curve, G, n, h);
}

function secp256r1() {
  // p = 2^224 (2^32 - 1) + 2^192 + 2^96 - 1
  var p = fromHex(
    "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF"
  );
  var a = fromHex(
    "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC"
  );
  var b = fromHex(
    "5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B"
  );
  //byte[] S = Hex.decode("C49D360886E704936A6678E1139D26B7819F7E90");
  var n = fromHex(
    "FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551"
  );
  var h = BigInteger.ONE;
  var curve = new ECCurveFp(p, a, b);
  var G = curve.decodePointHex(
    "04" +
      "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296" +
      "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5"
  );
  return new X9ECParameters(curve, G, n, h);
}

// make this into a proper hashtable
function getSECCurveByName(name) {
  if (name == "secp224r1") return secp224r1();
  if (name == "secp256r1") return secp256r1();
  return null;
}
