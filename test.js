// test code

const { Blockchain, Transaction }  = require('./TcoinBlockchain');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('4390e6084604d7421530e06ccd8980494dc2a9d319fd9c30a121d53ac5e1c1e3');
const myWalletAddress = myKey.getPublic('hex');

//blockchain created
const Tcoin = new Blockchain();

const trans1 = new Transaction(myWalletAddress, 'pubkey goes here', 10 ); //transaction created going from one address to another along with value of transaction.
trans1.signTransaction(myKey); //transaction signed with const key

Tcoin.addTransaction(trans1);




console.log('\n initiating mining....');

Tcoin.minePendingTransaction(myWalletAddress); // method expects a mining reward address

console.log('\n Balence of thomas is', Tcoin.getBalenceOfAddress(myWalletAddress));

Tcoin.chain[1].transactions[0].amount=1;

console.log('chain validation check:' , Tcoin.isChainvalid() ); 
