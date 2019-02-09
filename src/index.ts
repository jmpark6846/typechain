import * as CryptoJS from 'crypto-js'

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;
    static calculateBlockHash = (
        index: number,
        previousHash: string,
        data: string,
        timestamp: number): string => CryptoJS.SHA256(index + previousHash + data + timestamp).toString();
    
    static validate = (block: Block): boolean => 
        typeof block.index === "number" &&
        typeof block.hash === "string" &&
        typeof block.previousHash === "string" &&
        typeof block.timestamp === "number" &&
        typeof block.data === "string";
        
    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number) {
        this.index = index
        this.hash = hash
        this.previousHash = previousHash
        this.data = data
        this.timestamp = timestamp
    }
}
const genesisBlock: Block = new Block(0, "aocmoaioxiwex", "", "hello", 1549680553)
let blockchain: Block[] = [genesisBlock]

const getBlockchain = (): Block[] => blockchain
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000)

const createNewBlock = (data: string): Block => {
    let latestBlock = getLatestBlock()
    let index = latestBlock.index + 1
    let newTimestamp = getNewTimestamp()
    let newBlock = new Block(
        index,
        Block.calculateBlockHash(index, latestBlock.hash, data, newTimestamp),
        latestBlock.hash,
        data,
        newTimestamp
    )
    addBlock(newBlock)
    return newBlock
}

const isBlockValid = (
    candidateBlock: Block,
    previousBlock: Block
): boolean => {
    if(!Block.validate(candidateBlock) && 
        previousBlock.index+1 !== candidateBlock.index &&
        previousBlock.hash !== candidateBlock.previousHash
    )
        return false
    return true
}

const addBlock = (candidateBlock: Block): void => {
    if(isBlockValid(candidateBlock, getLatestBlock())){
        blockchain.push(candidateBlock)
    }
}

console.log(createNewBlock('joonmo'), createNewBlock('lsy'))
