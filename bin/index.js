#!/usr/bin/env node

const { program } = require('commander');
const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');

program
  .version('1.0.0')
  .arguments('<projectName>')
  .action(async (projectName) => {
    const targetDir = path.join(process.cwd(), projectName);

    // Ensure the target directory does not already exist
    if (await fs.pathExists(targetDir)) {
      console.error(`Error: Directory ${projectName} already exists.`);
      process.exit(1);
    }

    // Clone the repository
    const repoUrl = 'https://github.com/Vignesh-Kumar-Sony/Application-Starter.git'; // Change to your repository URL
    try {
      await simpleGit().clone(repoUrl, targetDir);
      console.log(`Repository cloned into ${targetDir}`);
      
      // Customize the cloned project (e.g., update package.json, etc.)
      const packageJsonPath = path.join(targetDir, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = projectName;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        console.log('Updated package.json');
      }

      console.log(`Project ${projectName} created successfully.`);
    } catch (err) {
      console.error('Error cloning repository:', err);
      process.exit(1);
    }
  });

program.parse(process.argv);
