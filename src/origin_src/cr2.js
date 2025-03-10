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
