const { Config } = require('@remotion/cli/config');

// Override the default chromium browser with Microsoft Edge per testing requirements
Config.setBrowserExecutable('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe');
