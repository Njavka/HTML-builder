const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, {
  flags: 'a',
  encoding: 'utf-8',
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function clearExit() {
  console.log('\nThank you! Bye-bye!');
  writeStream.end();
  rl.close();
}
function promptUser() {
  rl.question('Type your text here (or type "exit" to exit): ', (input) => {
    if (input.toLowerCase() === 'exit') {
      clearExit();
      return;
    }
    writeStream.write(input + '\n', (err) => {
      if (err) {
        console.error('File write error:', err);
      } else {
        console.log('File write successful.');
      }
      promptUser();
    });
  });
}

process.stdin.on('data', function (data) {
  if (data.toString() === '\u0003') {
    clearExit();
  }
});

promptUser();