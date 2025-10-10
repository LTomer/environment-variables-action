import { warning, info, startGroup, endGroup } from '@actions/core';

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

// /**
//  * Prints a greeting message with the provided name
//  */
// function printGreeting(): void {
//   const name = getInput('name');
//   console.log(`Hello ${name}!`);
// }

/**
 * Prints a list of key-value pairs to screen in a grouped format
 * @param title - The title for the group
 * @param vars - Array of key-value pairs to print
 */
function printVariablesToScreen(title: string, vars: KeyValuePair[]): void {
  if (vars.length === 0) return;
  
  startGroup(title);
  
  // Find the maximum key length for alignment
  const maxKeyLength = vars.reduce((max, { key }) => Math.max(max, key.length), 0);
  
  vars.forEach(({ key, value }) => {
    // Pad the key to align equal signs
    const paddedKey = key.padEnd(maxKeyLength);
    
    // Handle multi-line values
    if (value.includes('\n')) {
      const lines = value.split('\n');
      const firstLine = lines[0];
      const indent = ' '.repeat(maxKeyLength + 3); // key length + ' = ' length
      
      // Print first line with key
      info(`${paddedKey} = ${firstLine}`);
      
      // Print continuation lines with proper indentation
      lines.slice(1).forEach(line => {
        info(`${indent}${line}`);
      });
    } else {
      // Single line value
      info(`${paddedKey} = ${value}`);
    }
  });
  
  info('');
  endGroup();
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
  singleVars.sort((a, b) => a.key.localeCompare(b.key));
  printVariablesToScreen(` Variables (${singleVars.length})`, singleVars);
  
  // Print groups with multiple variables
  multipleVarPrefixes.forEach(prefix => {
    const vars = groupedVars.get(prefix)!;
    printVariablesToScreen(` ${prefix} Variables (${vars.length})`, vars);
  });
}

/**
 * Prints runner environment information
 */
function printRunnerInformation(): void {
  // Basic runner information
  const basicInfo: KeyValuePair[] = [
    { key: 'Node.js version', value: process.version },
    { key: 'Platform', value: process.platform },
    { key: 'Architecture', value: process.arch },
    { key: 'Working Directory', value: process.cwd() }
  ];
  printVariablesToScreen('Runner Information', basicInfo);
}

function printSystemInformation(): void {

  // System information
  const systemInfo: KeyValuePair[] = [
    { key: 'Process ID', value: process.pid.toString() },
    { key: 'Parent Process ID', value: process.ppid.toString() },
    { key: 'User ID', value: process.getuid ? process.getuid().toString() : 'N/A' },
    { key: 'Group ID', value: process.getgid ? process.getgid().toString() : 'N/A' },
    { key: 'Memory Usage', value: JSON.stringify(process.memoryUsage(), null, 2) },
    { key: 'CPU Usage', value: JSON.stringify(process.cpuUsage(), null, 2) },
    { key: 'Uptime', value: `${process.uptime()} seconds` },
    { key: 'Command Line Args', value: JSON.stringify(process.argv) },
    { key: 'Node.js Executable Path', value: process.execPath },
    { key: 'Node.js Execute Arguments', value: JSON.stringify(process.execArgv) }
  ];

  // Additional system information
  if (process.platform !== 'win32') {
    try {
      const os = require('os');
      systemInfo.push(
        { key: 'OS Type', value: os.type() },
        { key: 'OS Release', value: os.release() },
        { key: 'OS Hostname', value: os.hostname() },
        { key: 'OS Total Memory', value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` },
        { key: 'OS Free Memory', value: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB` },
        { key: 'OS Load Average', value: JSON.stringify(os.loadavg()) },
        { key: 'OS CPU Count', value: os.cpus().length.toString() },
        { key: 'OS CPU Model', value: os.cpus()[0]?.model || 'Unknown' }
      );
    } catch (error) {
      systemInfo.push({ key: 'OS Info Error', value: error?.toString() || 'Unknown error' });
    }
  }

  // Print using the regular print function
  printVariablesToScreen('System Information', systemInfo);
}

/**
 * Main function that orchestrates the action execution
 */
function run(): void {
  try {
    // Print runner information
    printRunnerInformation();

    info('')

    // Print environment variables in grouped format
    printAllEnvironmentVariables();

    info('')

    // Print system information
    printSystemInformation();
  } catch (error) {
    console.error('Error running action:', error);
    process.exit(1);
  }
}

// Execute the main function
run();
