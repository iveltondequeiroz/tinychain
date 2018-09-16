const SHA256 = require('crypto-js/sha256')

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash=''){
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash(){
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
  }

  mineBlock(difficult){
    while(this.hash.substring(0, difficult) !== Array(difficult + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash()
    }
    console.log("Block mined : "+this.hash)
  }
}

class Blockchain{
  constructor(){
    this.tinychain = [this.createGenesisBlock()]
    this.difficult = 3
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock(){
    return new Block("01/01/2018", "Genesis", "0", )
  }

  getLatestBlock(){
    return this.tinychain[this.tinychain.length-1]
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash
    //newBlock.hash = newBlock.calculateHash()
    newBlock.mineBlock(this.difficult)
    this.tinychain.push(newBlock) 
  }

  isChainValid(){
    // checks the whole chain
    for(let i=1; i<this.tinychain.length; i++){
      const currentBlock = this.tinychain[i];
      const previousBlock = this.tinychain[i-1];
      // hash still valid ?
      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      // current block points to the right block?
      if(currentBlock.previousHash !== previousBlock.hash) {
        return false;        
      }
    }
    // chain is valid
    return true;
  }

  minePendingTransactions(miningRewardAddress){
      let block = new Block(Date.now(), this.pendingTransactions)
      block.mineBlock(this.difficult)
      console.log("Blok successfully mined.")
      this.tinychain.push(block)
      this.pendingTransactions = [
        new Transaction(null, miningRewardAddress, this.miningReward)
      ] 
  }

  createTransaction(transaction){
      this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address){
    let balance=0
    for(const block of this.tinychain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount
        }
        if(trans.toAddress === address){
          balance += trans.amount
        }
      }
    }
    return balance
  }
}

// instantiate tinychain
let tinyCoin = new Blockchain()
tinyCoin.createTransaction('address1', 'address2', 100)
tinyCoin.createTransaction('address2', 'address1', 50)

console.log('Starting the miner...')
tinyCoin.minePendingTransactions('ivelton-address')
console.log('Balance of Ivelton is', tinyCoin.getBalanceOfAddress('ivelton-address'))
console.log('Starting the miner again...')
tinyCoin.minePendingTransactions('ivelton-address')
console.log('Balance of Ivelton is', tinyCoin.getBalanceOfAddress('ivelton-address'))


//console.log("mining block 1...")
//tinyCoin.addBlock(new Block(1, "01/02/2018", {amount:5}))
//console.log("mining block 2...")
//tinyCoin.addBlock(new Block(2, "02/02/2018", {amount:10}))

//console.log("is chain valid ? " + tinyCoin.isChainValid())
// tampering block
//tinyCoin.tinychain[1].data = {amount:50}
//tinyCoin.tinychain[1].hash = tinyCoin.tinychain[1].calculateHash()
//console.log("is chain valid ? " + tinyCoin.isChainValid())


//console.log(JSON.stringify(tinyCoin, null, 4))

