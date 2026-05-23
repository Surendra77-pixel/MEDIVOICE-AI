const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'lottiefiles.com',
  path: '/free-animation/little-power-robot-BtnSKUJQgN',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('lottie.html', data);
    console.log('saved');
  });
});
req.end();
