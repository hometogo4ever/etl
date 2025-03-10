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

fn_set_ec_params();
fn_set_client_prikey();
fn_set_client_pubkey();
console.log("client_prikey:", client_prikey);
console.log("client_pubkey:", client_pubkey);
