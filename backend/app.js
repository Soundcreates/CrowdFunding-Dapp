const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const CrowdfundingABI = require('./contract/Crowdfunding.json');
dotenv.config();

const PORT = 5000;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  withCredentials: true
}))

app.get('/api/contracts', async (req, res) => {
  if (!CONTRACT_ADDRESS || !CrowdfundingABI) {
    console.log("contract details are not available");
  }
  return res.json({ contractAddress: CONTRACT_ADDRESS, contractABI: CrowdfundingABI });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})