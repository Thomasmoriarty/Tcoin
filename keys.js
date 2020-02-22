
const Quay = require('elliptic').ec
const ec = new Quay('secp256k1');

const key = ec.genKeyPair(); // object contains get private and get public methods  
const publicKey = key.getPublic('hex');
const privatekey = key.getPrivate('hex');


console.log();
console.log('Public key: ', publicKey);

console.log();
console.log('private key ', privatekey);

