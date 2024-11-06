const {ethers } = require("ethers");
const fs= require("fs-extra");
require('dotenv').config();
async function main (){
console.log("starting the scriipt...");
const provider= new ethers.JsonRpcProvider("http://127.0.0.1:8545");
console.log("provider created ...");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY,provider);
console.log("wallet created ");

const abi = fs.readFileSync("./voting_sol_votingSystem.abi","utf-8");
const binary = fs.readFileSync("./voting_sol_votingSystem.bin","utf-8");
console.log("abi and binary read successfully  ");

const voter= new ethers.ContractFactory(abi,binary,wallet);
console.log("contract factory created ");

const contract = await voter.deploy();
console.log("contract deployed successfully");

console.log(contract);
const reciept = await contract.waitForDeployment(); 
const add= await contract.getAddress();
console.log(add);
const  voteContract= new ethers.Contract(add,abi,wallet);

async function addProposal(proposalName){
  try{
    const tx= await voteContract.addProposal(proposalName);
    await tx.wait(6);
    console.log(`proposal name ${proposalName} added `);
  }catch(error){
    console.error(error);
  }
}
async function vote(proposalId){
  try{
    const tx= await voteContract.vote(proposalId);
    await tx.wait(6);
    console.log(`voted for proposal id : ${proposalId}`);
  }catch(error){
    console.error(error);
  }}
  async function getWinningProposal() {
    try {
        const winningProposal = await voteContract.getWinningProposal();
        console.log(`Winning Proposal: ${winningProposal[0]}, Votes: ${winningProposal[1]}`);
    } catch (error) {
        console.error("Error getting winning proposal:", error);
    }
}
  await addProposal("Proposal A");
  await addProposal("Proposal B");
  await vote(0);
  await getWinningProposal();
}
main().catch((error) => {
  console.error("Error in script:", error);
  process.exitCode = 1;
});