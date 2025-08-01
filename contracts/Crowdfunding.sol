/// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;



contract Crowdfunding {
    struct Campaign{
        address creator;
        uint goal;
        uint pledged;
        uint startAt;
        uint endAt;
        bool claimed;

    }


    uint public count;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping( address => uint)) public pledgedAmount;

    //events
    event launched(uint id, address creator, uint goal, uint startAt, uint endAt, string message);
    event pledged(uint id, address pledger, uint pledgedAmount, string message);
    event unpledged(uint id, address pledger, string message);
    event claimed(uint id, address claimer, uint amountToSendBack, string message);
    event refunded(uint id, address payerToRefund, uint refundedAmount , string message);



    function launch(uint _goal, uint _duration) public {
        require(_duration <= 90 days, "Too long of a campaign");
        count++;
        campaigns[count].creator = msg.sender;
        campaigns[count].goal = _goal;
        campaigns[count].startAt = block.timestamp;
        campaigns[count].endAt = block.timestamp + _duration;
        emit launched(count, msg.sender, _goal, campaigns[count].startAt, campaigns[count].endAt, "Campaign has been launched successfully");


    }

    function pledge(uint _id) public payable {
        Campaign storage campaign = campaigns[_id];
        
        require(block.timestamp <= campaign.endAt, "The campaign is over");
        campaign.pledged += msg.value;
        pledgedAmount[_id][msg.sender] += msg.value;
        emit pledged(_id, msg.sender, pledgedAmount[_id][msg.sender], "You have pledged to the campaign successfully");
   }

    function unpledge(uint _id, uint _amount) public {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.endAt, "The campaign is over");
        require(_amount <= pledgedAmount[_id][msg.sender], "You haven't pledged that much");

        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender]-=_amount;
        payable(msg.sender).transfer(_amount);
        emit unpledged(_id, msg.sender, "You have unpledged to the campaign successfuly");
    }

    function claim(uint _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.creator, "You are not the creator of the campaign, access prevoked");
        require(block.timestamp > campaign.endAt, "This campaign hasn't ended yet");
        require(campaign.pledged >= campaign.goal, "The goal of this campaign hasn't been fulfilled yet" );
        require(!campaign.claimed, "The campaign has already been claimed");
        uint amountToSendBack = campaign.pledged;
        campaign.pledged -= amountToSendBack;
        payable(msg.sender).transfer(amountToSendBack);
        campaign.claimed = true;
        emit claimed(_id, msg.sender, amountToSendBack, "You have claimed the campaign successfully");

    }

    function refund(uint _id) public  {
        Campaign storage campaign = campaigns[_id];
        require(campaign.pledged < campaign.goal, "The goal has been reached, refund unsuccessful");
        require(block.timestamp > campaign.endAt,  "The campaign hasnt ended yet");
        require(pledgedAmount[_id][msg.sender] > 0 , "You haven't pledged any amount to the campaign");
        uint amountToRefund = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] -= amountToRefund;
        payable(msg.sender).transfer(amountToRefund);
        emit refunded(_id, msg.sender, amountToRefund, "The amount pledged to the campaign has been refunded to you successfully");

    }

    function getCampaign(uint _id) public view returns(
        address creator,
        uint goal,
        uint _pledged,
        uint startAt,
        uint endAt,
        bool _claimed
    )
    {
        Campaign storage c = campaigns[_id];
        return (c.creator, c.goal, c.pledged, c.startAt, c.endAt, c.claimed);
    }
}