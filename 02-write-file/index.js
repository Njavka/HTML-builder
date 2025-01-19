const fileSys = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fileSys.createWriteStream(filePath, {
  flags: 'a',
  encoding: 'utf-8',
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  rl.question('Type your text here (or type "exit" to exit): ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Thank you! Bye-bye!');
      rl.close();
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

promptUser();

process.on('SIGINT', () => {
  console.log('\nThank you! Bye-bye!');
  rl.close();
});
