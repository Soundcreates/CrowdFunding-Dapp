const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const CrowdfundingABI = require('./contract/Crowdfunding.json');
dotenv.config();

const PORT = 5000;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.get('/api/contracts', async (req, res) => {
  if (!CONTRACT_ADDRESS || !CrowdfundingABI) {
    console.log("contract details are not available");
  }
  return res.json({ contractAddress: CONTRACT_ADDRESS, contractABI: CrowdfundingABI });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})