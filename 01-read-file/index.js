const fileSys = require('fs');

const streamFile = fileSys.createReadStream('01-read-file/text.txt', {
  encoding: 'utf-8',
});

streamFile.on('data', (chunk) => {
  console.log(chunk);
});

streamFile.on('error', (error) => {
  console.error('File read error:', error);
});