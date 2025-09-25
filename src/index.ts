import { getInput, info, startGroup, endGroup } from '@actions/core';

/**
 * Interface for key-value pairs
 */
interface KeyValuePair {
  key: string;
  value: string;
}

/**
 * Gets all environment variables as a list of key-value pairs
 * @returns Array of key-value pairs sorted by key
 */
function getAllEnvironmentVariables(): KeyValuePair[] {
  return Object.keys(process.env)
    .sort()
    .map(key => ({
      key,
      value: process.env[key] || ''
    }));
}

/**
 * Prints all environment variables grouped by prefix
 */
function printAllEnvironmentVariables(): void {
  const envVars = getAllEnvironmentVariables();
  
  // Group environment variables by prefix and separate single variables
  const groupedVars = new Map<string, KeyValuePair[]>();
  const singleVars: KeyValuePair[] = [];
  
  envVars.forEach(({ key, value }) => {
    // If the key doesn't contain underscore, put it directly in single variables
    if (!key.includes('_')) {
      singleVars.push({ key, value });
      return;
    }
    
    // Otherwise, group by prefix
    const prefix = key.split('_')[0];
    
    if (!groupedVars.has(prefix)) {
      groupedVars.set(prefix, []);
    }
    groupedVars.get(prefix)!.push({ key, value });
  });
  
  // Separate prefixes with multiple variables from single variables
  const multipleVarPrefixes: string[] = [];
  
  groupedVars.forEach((vars, prefix) => {
    if (vars.length > 1) {
      multipleVarPrefixes.push(prefix);
    } else {
      // Add single variables from prefixes to the single variables array
      singleVars.push(...vars);
    }
  });
  
  // Sort prefixes alphabetically
  multipleVarPrefixes.sort();
  
  // Print single variables in generic group
  if (singleVars.length > 0) {
    // info('');
    // info('--- Variables ---');
    startGroup(` > Variables`);
    singleVars.sort((a, b) => a.key.localeCompare(b.key));
    singleVars.forEach(({ key, value }) => {
      info(`${key} = ${value}`);
    });
    endGroup();
  }
  
  // Print groups with multiple variables
  multipleVarPrefixes.forEach(prefix => {
    startGroup(` > ${prefix} Variables`);
    const vars = groupedVars.get(prefix)!;
    vars.forEach(({ key, value }) => {
      info(`${key} = ${value}`);
    });
    endGroup();
  });
}

/**
 * Prints runner environment information
 */
function printRunnerInformation(): void {
  info(`Node.js version: ${process.version}`);
  info(`Platform: ${process.platform}`);
  info(`Architecture: ${process.arch}`);
  info(`Working Directory: ${process.cwd()}`);
  info(`Process ID: ${process.pid}`);
  info(`Parent Process ID: ${process.ppid}`);
  info(`User ID: ${process.getuid ? process.getuid() : 'N/A'}`);
  info(`Group ID: ${process.getgid ? process.getgid() : 'N/A'}`);
  info(`Memory Usage: ${JSON.stringify(process.memoryUsage(), null, 2)}`);
  info(`CPU Usage: ${JSON.stringify(process.cpuUsage(), null, 2)}`);
  info(`Uptime: ${process.uptime()} seconds`);
  info(`Command Line Args: ${JSON.stringify(process.argv)}`);
  info(`Node.js Executable Path: ${process.execPath}`);
  info(`Node.js Execute Arguments: ${JSON.stringify(process.execArgv)}`);
  
  // Additional system information
  if (process.platform !== 'win32') {
    try {
      const os = require('os');
      info(`OS Type: ${os.type()}`);
      info(`OS Release: ${os.release()}`);
      info(`OS Hostname: ${os.hostname()}`);
      info(`OS Total Memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
      info(`OS Free Memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
      info(`OS Load Average: ${JSON.stringify(os.loadavg())}`);
      info(`OS CPU Count: ${os.cpus().length}`);
      info(`OS CPU Model: ${os.cpus()[0]?.model || 'Unknown'}`);
    } catch (error) {
      info(`OS Info Error: ${error}`);
    }
  }
}

/**
 * Main function that orchestrates the action execution
 */
function run(): void {
  try {
    // Print runner information
    startGroup('Runner Information');
    printRunnerInformation();
    endGroup();

    info('')
    
    // Print environment variables in grouped format
    printAllEnvironmentVariables();
  } catch (error) {
    console.error('Error running action:', error);
    process.exit(1);
  }
}

// Execute the main function
run();
