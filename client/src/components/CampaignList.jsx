import React from 'react'
import { ethers } from 'ethers';

function CampaignList({ campaigns }) {
  return (
    <>
      {campaigns.map((campaign, index) => {
        return (
          <div key={index} className="border p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold">{campaign.name}</h2>
            <p className="text-gray-600">Goal: {ethers.formatEther(campaign.goal)} ETH</p>
            <p className="text-gray-600">Pledged: {ethers.formatEther(campaign.pledged)} ETH</p>
            <p className="text-gray-600">Duration: {campaign.duration / (24 * 60 * 60)} days</p>
            <p className="text-gray-600">Created by: {campaign.creator}</p>
            <p className="text-gray-600">Start At: {campaign.startAt}</p>
            <p className="text-gray-600">End At: {campaign.endAt}</p>
          </div>
        )
      })
      }
    </>
  )
}

export default CampaignList