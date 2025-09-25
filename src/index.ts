import { getInput, info, startGroup, endGroup } from '@actions/core';

// Get input from action
const name = getInput('name');

// Print greeting
console.log(`Hello ${name}!`);

// Print environment variables in a grouped format
startGroup('Environment Variables');

// Print all environment variables
info('=== All Environment Variables ===');
Object.keys(process.env)
  .sort()
  .forEach(key => {
    const value = process.env[key];
    info(`${key}=${value}`);
  });

// Print GitHub-specific environment variables in a separate section
startGroup('GitHub-specific Environment Variables');
const githubVars = Object.keys(process.env)
  .filter(key => key.startsWith('GITHUB_'))
  .sort();

if (githubVars.length > 0) {
  info('=== GitHub Environment Variables ===');
  githubVars.forEach(key => {
    const value = process.env[key];
    info(`${key}=${value}`);
  });
} else {
  info('No GitHub-specific environment variables found');
}

endGroup();
endGroup();

// Print runner environment info
startGroup('Runner Information');
info(`Node.js version: ${process.version}`);
info(`Platform: ${process.platform}`);
info(`Architecture: ${process.arch}`);
info(`Working Directory: ${process.cwd()}`);
endGroup();
