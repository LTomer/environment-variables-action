import { getInput, info, startGroup, endGroup } from '@actions/core';

/**
 * Interface for key-value pairs
 */
interface KeyValuePair {
  key: string;
  value: string;
}

/**
 * Interface for environment variables result with metadata
 */
interface EnvironmentVariablesResult {
  envVars: KeyValuePair[];
  maxValueSize: number;
}

/**
 * Gets all environment variables as a list of key-value pairs
 * @returns Object containing array of key-value pairs sorted by key and max value size
 */
function getAllEnvironmentVariables(): EnvironmentVariablesResult {
  const envVars = Object.keys(process.env)
    .sort()
    .map(key => ({
      key,
      value: process.env[key] || ''
    }));

  const maxValueSize = envVars.reduce((max, { value }) => 
    Math.max(max, value.length), 0
  );

  return {
    envVars,
    maxValueSize
  };
}

/**
 * Prints a greeting message with the provided name
 */
function printGreeting(): void {
  const name = getInput('name');
  console.log(`Hello ${name}!`);
}

/**
 * Prints all environment variables grouped by prefix
 */
function printAllEnvironmentVariables(): void {
  info('=== All Environment Variables ===');
  const { envVars, maxValueSize } = getAllEnvironmentVariables();
  
  // Group environment variables by prefix
  const groupedVars = new Map<string, KeyValuePair[]>();
  
  envVars.forEach(({ key, value }) => {
    const prefix = key.includes('_') ? key.split('_')[0] : 'OTHER';
    
    if (!groupedVars.has(prefix)) {
      groupedVars.set(prefix, []);
    }
    groupedVars.get(prefix)!.push({ key, value });
  });
  
  // Separate prefixes with multiple variables from single variables
  const multipleVarPrefixes: string[] = [];
  const singleVars: KeyValuePair[] = [];
  
  groupedVars.forEach((vars, prefix) => {
    if (vars.length > 1) {
      multipleVarPrefixes.push(prefix);
    } else {
      singleVars.push(...vars);
    }
  });
  
  // Sort prefixes alphabetically
  multipleVarPrefixes.sort();
  
  // Print single variables in generic group
  if (singleVars.length > 0) {
    info('');
    info('--- Variables ---');
    singleVars.sort((a, b) => a.key.localeCompare(b.key));
    singleVars.forEach(({ key, value }) => {
      info(`${key} = ${value}`);
    });
  }
  
  // Print groups with multiple variables
  multipleVarPrefixes.forEach(prefix => {
    info('');
    info(`--- ${prefix} Variables ---`);
    const vars = groupedVars.get(prefix)!;
    vars.forEach(({ key, value }) => {
      info(`${key} = ${value}`);
    });
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
}

/**
 * Main function that orchestrates the action execution
 */
function run(): void {
  try {
    // Print greeting
    printGreeting();

    // Print runner information
    startGroup('Runner Information');
    printRunnerInformation();
    endGroup();

    // Print environment variables in grouped format
    startGroup('Environment Variables');
    printAllEnvironmentVariables();
    endGroup();
  } catch (error) {
    console.error('Error running action:', error);
    process.exit(1);
  }
}

// Execute the main function
run();
