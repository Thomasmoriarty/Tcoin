const SHA256 = require('crypto-js/sha256'); //intialising the hashing package inside the variable sha256

const EC = require('elliptic').ec
const ec = new Quay('secp256k1');

class Transaction {  

    constructor ( fromAddress, toAddress, amount ){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount= amount;
    
  }
    
    calculateHash(){ // hashed to a string
        return SHA256(this.fromAddress +this.toAddress +this.amount).toString();
    }

   signTransaction(signingKey){ //recieves a signing key object from E library containing private and public key.

    if (signingKey.getPublic('hex') !== this.Address){ //if public ky doesnt match the address throw error
       //throw new Error('You cannot sign tranactions for the other wallets!')
    }
       const hashedTrans = this.calculateHash();
       const sig = signingKey.sign(hashedTrans, 'base64'); 
       this.signature= sig.toDER('hex'); //signtaure converted to DER format
    
   }
   
       isValid(){ 
        if(this.fromAddress === null) {
        return true;    //null check
        }

        if (!this.signature || this.signature.length === 0){ //signature ?
            throw new Error ('No signature for this transaction');
        }
        const publicKey=ec.keyFromPublic(this.fromAddress, 'hex'); //extract public key from it
        return publicKey.verify(this.calculateHash(), this.signature); 
    }
   
}

//block class intialising the various variables associated
class Block {

  constructor(timeStamp, transactions , previousHash= '') { 
    
    this.timeStamp=timeStamp;
    this.transactions=transactions;
    this.previousHash=previousHash;
    this.hash = this.calculateHash();
    this.nonce= 0; 
    //nonce variable = number which can be changed to something random so that no other variables have to be changed.
  }
  //hashing function where data is hashed to a string 
  calculateHash() {
    // SHA256 VARIABLE 
    return SHA256(this.previousHash + this.timeStamp + JSON.stringify(this.transactions)+ this.nonce).toString(); //nonce isnt taken into hash
  }

 mineBlock(difficulty){
      //while loop starting in a substring of the hashed string from 0 -> whatever difficulty is set to 
      // second part of the hash is != all zeros Therefore creat an array of length difficulty # and join it with "0";  
      while(this.hash.substring (0, difficulty) !== Array(difficulty + 1).join("0")){
         
        this.nonce++; 
        this.hash=this.calculateHash();   
      }
      console.log("block has been mined "+ this.hash); 
     }
  
  hasValidTransactions(){
      for (const tx of this.transactions) {
             if (!tx.isValid()) {  //valid check on transactions
              return false;
          }
      
      return true; 
     }
    
     }
}

    

class Blockchain {
   
        constructor() {  //constructor responsible for initialising the block chain
         this.chain =[this.createGenesisBlock()];
         this.difficulty = 2; 
         this.pendingTrans = [];
         this.miningReward = 100;
         }
      
         createGenesisBlock(){
         return new Block ("01/01/2020", "Geneis block", "0");
          }
      
      
          getlatestBlock(){ //return latest block in the chain 
            return this.chain [this.chain.length-1];
          }
      
         
        minePendingTransaction(miningRewardAddress){
            const rewardTrans = new Transaction (null, miningRewardAddress, this.miningReward);
            this.pendingTrans.push(rewardTrans);

            let block = new Block(Date.now(), this.pendingTrans, this.getlatestBlock().hash);
            block.mineBlock(this.difficulty);
      
            console.log('block successfully mined!');
            this.chain.push(block);
      
            this.pendingTrans= [ ];
          } 
      
       addTransaction (transaction){ //recieve transaction and push it onto the pending tx array
          if (!transaction.fromAddress || !transaction.toAddress){ 
               throw new Error ('Transaction must include from and to address');
           }
           if(!transaction.isValid()){
               throw new Error('cannot add invalid transaction to chain');
           }
           this.pendingTrans.push(transaction);
       }
      
       getBalenceOfAddress(address){
           let balance = 0;
      
           for(const block of this.chain){
               for (const trans of block.transactions){
                 if(trans.fromAddress === address){
                     balance -= trans.amount;
                 }
                 if(trans.toAddress === address){
                     balance += trans.amount;
                  }
                 }  
               }
               return balance;
             }
      
          isChainvalid (){
            //start at index 1 not 0 cause genesis block
            // loop through the blockchain array ,, if statements checking h
            for (let i=1;i < this.chain.length ;i++){
              const currentBlock = this.chain[i];
              const previousBlock =this.chain[i - 1];
              
              if (!currentBlock.hasValidTransactions() ){ 
                  return false;
              }
       
              if (currentBlock.hash !== currentBlock.calculateHash()) { // recalculate the hash
                return false;
              }
      
              //is the reference to the previous block valid ?
            if (currentBlock.previousHash !== previousBlock.calculateHash() ){
              
              return false;
            }

            }

             return true ; //valid 
            
            
             }
        
        
}  

module.exports.Blockchain= Blockchain;
module.exports.Transaction= Transaction;  
module.exports.Block=Block;
