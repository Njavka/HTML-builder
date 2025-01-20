const fs = require('fs');
const path = require('path');

async function buildProject() {
    const projectDistDir = path.join(__dirname, 'project-dist');
    const componentsDir = path.join(__dirname, 'components');
    const stylesDir = path.join(__dirname, 'styles');
    const assetsDir = path.join(__dirname, 'assets');
    const templateFile = path.join(__dirname, 'template.html');
    const outputHtmlFile = path.join(projectDistDir, 'index.html');
    const outputCssFile = path.join(projectDistDir, 'style.css');

    try {
        await fs.promises.mkdir(projectDistDir, { recursive: true });

        let templateContent = await fs.promises.readFile(templateFile, 'utf-8');

        const regex = /{{\s*([a-zA-Z0-9-_]+)\s*}}/g;
        const matches = [...templateContent.matchAll(regex)];

        for (const match of matches) {
            const componentName = match[1];
            const componentFilePath = path.join(componentsDir, `${componentName}.html`);

            try {
                const componentContent = await fs.promises.readFile(componentFilePath, 'utf-8');
                templateContent = templateContent.replace(match[0], componentContent);
            } catch (err) {
                console.error(`Error reading component ${componentName}:`, err.message);
            }
        }

        await fs.promises.writeFile(outputHtmlFile, templateContent);
        await compileStyles(stylesDir, outputCssFile);
        await copyAssets(assetsDir, path.join(projectDistDir, 'assets'));

        console.log('Project built successfully!');

    } catch (error) {
        console.error('Error during build:', error);
    }
}

async function compileStyles(stylesDir, outputCssFile) {
    try {
        try {
            await fs.promises.access(outputCssFile);
            await fs.promises.unlink(outputCssFile);
        } catch (err) {
        }

        const files = await fs.promises.readdir(stylesDir);
        const cssFiles = files.filter(file => path.extname(file) === '.css');
        const writeStream = fs.createWriteStream(outputCssFile);

        await Promise.all(cssFiles.map(async (file) => {
            const filePath = path.join(stylesDir, file);
            const data = await fs.promises.readFile(filePath, 'utf-8');
            writeStream.write(data + '\n');
        }));

        writeStream.end();
        
        writeStream.on('finish', () => {
            console.log('Styles compiled successfully into style.css!');
        });

    } catch (error) {
        console.error('Error during styles compilation:', error);
    }
}

async function copyAssets(srcDir, destDir) {
    try {
        await fs.promises.mkdir(destDir, { recursive: true });
        
        const files = await fs.promises.readdir(srcDir);

        await Promise.all(files.map(async (file) => {
            const srcFilePath = path.join(srcDir, file);
            const destFilePath = path.join(destDir, file);

            const stats = await fs.promises.stat(srcFilePath);

            if (stats.isDirectory()) {
                await copyAssets(srcFilePath, destFilePath);
            } else {
                await fs.promises.copyFile(srcFilePath, destFilePath);
            }
        }));
        
    } catch (error) {
        console.error('Error during assets copying:', error);
    }
}

buildProject();