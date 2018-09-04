const SHA256 = require('crypto-js/sha256')

class Block {
  constructor(index, timestamp, data, previousHash=''){
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
  }
}

class Blockchain{
  constructor(){
    this.tinychain = [this.createGenesisBlock()]
  }

  createGenesisBlock(){
    return new Block(0, "01/01/2018", "Genesis", "0", )
  }

  getLatestBlock(){
    return this.tinychain[this.tinychain.length-1]
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.hash = newBlock.calculateHash()
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
}

// instantiate tinychain
let tinyCoin = new Blockchain()
tinyCoin.addBlock(new Block(1, "01/02/2018", {amount:5}))
tinyCoin.addBlock(new Block(2, "02/02/2018", {amount:10}))
console.log("is chain valid ? " + tinyCoin.isChainValid())
// tampering block
tinyCoin.tinychain[1].data = {amount:50}
tinyCoin.tinychain[1].hash = tinyCoin.tinychain[1].calculateHash()
console.log("is chain valid ? " + tinyCoin.isChainValid())


//console.log(JSON.stringify(tinyCoin, null, 4))

