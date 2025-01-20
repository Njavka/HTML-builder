const fs = require('fs');
const path = require('path');

async function compileStyles() {
    const stylesDir = path.join(__dirname, 'styles');
    const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

    try {
        try {
            await fs.promises.access(outputFile);
            await fs.promises.unlink(outputFile);
        } catch (err) {
        }

        const files = await fs.promises.readdir(stylesDir);
        const cssFiles = files.filter(file => path.extname(file) === '.css');
        const writeStream = fs.createWriteStream(outputFile);

        await Promise.all(cssFiles.map(async (file) => {
            const filePath = path.join(stylesDir, file);
            const data = await fs.promises.readFile(filePath, 'utf-8');
            writeStream.write(data + '\n');
        }));

        writeStream.end();

        writeStream.on('finish', () => {
            console.log('Styles compiled successfully into bundle.css!');
        });

    } catch (error) {
        console.error('Error during compilation:', error);
    }
}

compileStyles();