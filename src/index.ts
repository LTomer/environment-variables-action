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
 * Prints all environment variables in alphabetical order
 */
function printAllEnvironmentVariables(): void {
  info('=== All Environment Variables ===');
  const { envVars, maxValueSize } = getAllEnvironmentVariables();
  //info(`Total environment variables: ${envVars.length}`);
  //info(`Maximum value size: ${maxValueSize} characters`);
  //info('');
  
  let previousPrefix = '';
  envVars.forEach(({ key, value }, index) => {
    // Get the prefix (part before first underscore, or the whole key if no underscore)
    const currentPrefix = key.includes('_') ? key.split('_')[0] : key;
    
    // Add empty line if prefix changed and it's not the first item
    if (index > 0 && currentPrefix !== previousPrefix) {
      info('');
    }
    
    //var space = '.'.repeat(maxValueSize - value.length + 3);
    info(`${key} = ${value}`);
    
    // Update previous prefix for next iteration
    previousPrefix = currentPrefix;
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
