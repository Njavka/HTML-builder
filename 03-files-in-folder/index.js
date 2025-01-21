const fileSys = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');


fileSys.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.isFile()) {
            const filePath = path.join(secretFolderPath, file.name);
            fileSys.stat(filePath, (err, stats) => {
              if (err) {
                  console.error('Error getting file stats:', err);
                  return;
              }
            const fileSize = stats.size;
            const fileExtension = path.extname(file.name).slice(1);
            const fileName = path.basename(file.name, path.extname(file.name));
            const sizeInKB = (fileSize / 1024).toFixed(3);

            console.log(`${fileName} - ${fileExtension} - ${sizeInKB}kB`);
            });
        }
    });
});