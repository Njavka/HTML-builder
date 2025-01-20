const fs = require('fs');
const path = require('path');

async function copyDir() {
    const sourceDir = path.join(__dirname, 'Files');
    const destinationDir = path.join(__dirname, 'files-copy');

    try {
        try {
            await fs.promises.access(destinationDir);
            const files = await fs.promises.readdir(destinationDir);
            await Promise.all(files.map(file => fs.promises.unlink(path.join(destinationDir, file))));
        } catch (err) {
            await fs.promises.mkdir(destinationDir);
        }

        const sourceFiles = await fs.promises.readdir(sourceDir);

        await Promise.all(sourceFiles.map(file => {
            const srcFile = path.join(sourceDir, file);
            const destFile = path.join(destinationDir, file);
            return fs.promises.copyFile(srcFile, destFile);
        }));

        console.log('Copy completed successfully!');
    } catch (error) {
        console.error('Error during copying:', error);
    }
}

copyDir();