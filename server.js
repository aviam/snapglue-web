const express = require('express');
const path = require('path');
const app = express();
// const gateway = process.env.GATEWAY_SERVER;
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
console.info(`\n\n💂  Listening at 3000 \n`);
app.listen(3000);
