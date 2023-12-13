import { KeyPair } from "../model/key_pair";
import nacl from "tweetnacl";
import util from "tweetnacl-util";

const numToUint8Array = (num: number) => {
  let arr = new Uint8Array(24);

  for (let i = 0; i < 24; i++) {
    arr[i] = num % 256;
    num = Math.floor(num / 256);
  }

  return arr;
};

export const encrypt = (
  msg: string,
  nonce: number,
  ourKeypair: KeyPair,
  theirKeypair: KeyPair
): string => {
  return util.encodeBase64(
    nacl.box(
      util.decodeUTF8(msg),
      numToUint8Array(nonce),
      util.decodeBase64(theirKeypair.pub_key),
      util.decodeBase64(ourKeypair.priv_key)
    )
  );
};

export const decrypt = (
  msg: string,
  nonce: number,
  ourKeypair: KeyPair,
  theirKeypair: KeyPair
): string | null => {
  const data = nacl.box.open(
    util.decodeBase64(msg),
    numToUint8Array(nonce),
    util.decodeBase64(theirKeypair.pub_key),
    util.decodeBase64(ourKeypair.priv_key)
  );

  if (!data) return null;

  return util.encodeUTF8(data);
};
