//SPDX-License-Identifier:MIT
pragma solidity ^0.8.8;
contract votingSystem{

struct proposal{
    uint voteCount;
    string name;
}

struct voter{
    bool hasVoted;
    bool isRegistered;
    uint proposalId;
}
address public owner;

proposal[] public proposals;

mapping(address=>voter) public voters;

 modifier onlyOwner(){
    require(msg.sender==owner,"owner can do this only");
    _;
 }
 modifier onlyRegisteredVoter(){
    require(voters[msg.sender].isRegistered,"register first ");
    _;
 }
 constructor() {
        owner = msg.sender;
        // Automatically register the owner as the only voter
        voters[owner] = voter({
            isRegistered: true,
            hasVoted: false,
            proposalId: 0
        });
    }

function addProposal(string memory _name) public onlyOwner{
proposals.push(proposal({
    name:_name,
    voteCount:0
}));
}
function vote(uint _proposalId) public onlyOwner{
   voter storage sender= voters[msg.sender];
   require(!sender.hasVoted,"already voted");
require(_proposalId<proposals.length,"invalid proposal id");
sender.hasVoted= true;
sender.proposalId=_proposalId;
proposals[_proposalId].voteCount+=1;
}
function getWinningProposal() public view returns (string memory name, uint voteCount){
    uint winningVoteCount=0;
    uint winnigProposalIndex=0;
     for(uint i=0;i<proposals.length;i++){
        if(proposals[i].voteCount>winningVoteCount){
            winningVoteCount = proposals[i].voteCount;
            winnigProposalIndex=i;
       }
     }
     return (proposals[winnigProposalIndex].name,proposals[winnigProposalIndex].voteCount);
}
}