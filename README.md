# Environment Inspector Action

A GitHub Action that displays comprehensive environment variable information and system details during workflow execution. This action helps debug and understand the runtime environment of your GitHub Actions workflows.

## Features

- 📋 **Environment Variables Display**: Shows all environment variables grouped intelligently by prefix
- 🖥️ **System Information**: Displays Node.js, platform, and system details  
- 🐛 **Debug Information**: Provides detailed process and OS information
- 📊 **Organized Output**: Groups related variables and uses collapsible sections
- ⚡ **Aligned Formatting**: Clean, professional output with aligned equal signs
- 🔍 **Multi-line Support**: Properly formats JSON and multi-line values

## Usage

### Basic Usage

```yaml
name: Environment Info Example

on: [push, pull_request]

jobs:
  show-environment:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Show Environment Variables
      uses: LTomer/env-inspector@v1
```

### Version Pinning Options

```yaml
# Use latest v1.x.x version (recommended for most users)
- uses: LTomer/env-inspector@v1

# Pin to specific version (recommended for production)
- uses: LTomer/env-inspector@v1.0.0

# Use specific commit (most secure)
- uses: LTomer/env-inspector@abc123
```

## What This Action Does

This action **requires no inputs** and automatically displays three categories of information:

### 1. Runner Information
- Node.js version and runtime details
- Platform (linux, windows, macOS)
- Architecture (x64, arm64, etc.)
- Current working directory

### 2. Environment Variables (Grouped)
Environment variables are intelligently organized:
- **Single Variables**: Variables without underscores or single variables from prefixes
- **Grouped Variables**: Variables with common prefixes (e.g., `GITHUB_*`, `npm_*`, `CI_*`)
- **Smart Grouping**: Only creates groups when there are multiple variables with the same prefix

### 3. System Information
- Process details (PID, parent PID, user/group IDs)
- Memory and CPU usage statistics
- System information (OS type, memory, CPU details)
- Command line arguments and execution path

## Output Example

The action produces organized, collapsible output like this:

```
🔽 Runner Information
├─ Node.js version    = v20.11.0
├─ Platform           = linux  
├─ Architecture       = x64
└─ Working Directory  = /github/workspace

🔽 Variables (12)
├─ HOME               = /home/runner
├─ PATH               = /usr/local/sbin:/usr/local/bin
├─ SHELL              = /bin/bash
└─ USER               = runner

🔽 GITHUB Variables (15)
├─ GITHUB_ACTIONS     = true
├─ GITHUB_ACTOR       = username
├─ GITHUB_REPOSITORY  = owner/repo-name
├─ GITHUB_SHA         = abc123def456
└─ GITHUB_WORKFLOW    = CI

🔽 npm Variables (8)
├─ npm_config_cache   = /home/runner/.npm
├─ npm_config_prefix  = /usr/local
└─ npm_version        = 10.2.4

🔽 System Information
├─ Process ID         = 1234
├─ Memory Usage       = {
│                       "rss": 45678912,
│                       "heapTotal": 12345678,
│                       "heapUsed": 8901234
│                       }
├─ OS Total Memory    = 7.75 GB
├─ OS Free Memory     = 3.21 GB
└─ OS CPU Count       = 2
```

## Use Cases

### Debugging Workflows
Perfect for troubleshooting when you need to understand:
- What environment variables are available
- System resources and configuration
- Runtime environment details

### Environment Discovery
Useful when:
- Setting up new workflows
- Understanding runner capabilities
- Documenting available environment variables

### Security Auditing
Helps with:
- Reviewing what environment data is available
- Understanding the runtime context
- Ensuring sensitive data isn't exposed

## Development Setup

### Prerequisites

- Node.js (v20 or later)
- npm
- Git

### Development Container (Recommended)

This repository includes a **Dev Container** configuration that provides a pre-configured development environment.

#### Using Dev Container:

**With VS Code:**
1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open the repository in VS Code
3. Click "Reopen in Container" when prompted
4. Everything will be set up automatically

**With GitHub Codespaces:**
- Click "Code" → "Codespaces" → "Create codespace"
- Development environment ready in the cloud

### Manual Local Setup

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd env-inspector
   npm install
   ```

2. **Make changes** in [`src/index.ts`](src/index.ts)

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Test locally**:
   ```bash
   node lib/index.js
   ```

## Project Structure

```
env-inspector/
├── src/
│   └── index.ts          # Main TypeScript source code
├── lib/
│   └── index.js          # Compiled JavaScript (generated)
├── dist/
│   └── index.js          # Bundled code for GitHub Actions (generated)  
├── action.yml            # Action metadata and configuration
├── package.json          # Dependencies and build scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This documentation
```

### Key Files

- **[`src/index.ts`](src/index.ts)**: Main source code with all the logic
- **[`action.yml`](action.yml)**: Action metadata - defines how GitHub Actions runs this action
- **[`package.json`](package.json)**: Build scripts and dependencies
- **`dist/index.js`**: The bundled file that GitHub Actions actually executes

### Code Architecture

The action is organized into focused functions:

- **[`getAllEnvironmentVariables()`](src/index.ts)**: Retrieves and sorts all environment variables
- **[`printVariablesToScreen()`](src/index.ts)**: Formats and displays key-value pairs with proper alignment
- **[`printAllEnvironmentVariables()`](src/index.ts)**: Groups variables by prefix intelligently  
- **[`printRunnerInformation()`](src/index.ts)**: Shows basic system information
- **[`printSystemInformation()`](src/index.ts)**: Displays detailed debug information
- **[`run()`](src/index.ts)**: Main orchestration function

### Development Workflow

1. **Edit source code** in [`src/index.ts`](src/index.ts)
2. **Build**: `npm run build` (compiles TypeScript + bundles dependencies)  
3. **Test**: `node lib/index.js`
4. **Commit**: Include both source and built files (`src/`, `lib/`, `dist/`)

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Build | `npm run build` | Compiles TypeScript and bundles for distribution |

## Contributing

1. Fork the repository
2. Create a feature branch  
3. Make your changes in [`src/index.ts`](src/index.ts)
4. Run `npm run build`
5. Test the action locally
6. Commit all changes (including built files in `lib/` and `dist/`)
7. Submit a pull request

## Troubleshooting

### Common Issues

**Build fails**: Ensure you have Node.js v20+ and run `npm install`

**Action doesn't work**: Make sure you've committed the `dist/index.js` file after building

**TypeScript errors**: Check syntax and ensure dependencies are installed with `npm install`

### Getting Help

If you encounter issues:
1. Verify you've run `npm run build` after making changes
2. Check that both `lib/` and `dist/` directories are committed
3. Ensure [`action.yml`](action.yml) points to the correct entry file (`dist/index.js`)

## License

This project is licensed under the ISC License.