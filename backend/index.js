const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/API/health', (req, res) => {
  res.json({ status: 'active', node: 'HEX-CORE-01' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
