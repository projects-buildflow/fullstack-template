#!/usr/bin/env node

/**
 * Environment verification script for TaskMaster internship
 * Generates a verification token upon successful setup
 */

const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 TaskMaster Environment Verification\n');
console.log('='.repeat(50));

let allPassed = true;
const checks = [];

// Check Node.js version
function checkNode() {
  try {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);
    if (major >= 18) {
      checks.push({ name: 'Node.js version', status: 'pass', detail: version });
    } else {
      checks.push({ name: 'Node.js version', status: 'fail', detail: `${version} (need 18+)` });
      allPassed = false;
    }
  } catch (e) {
    checks.push({ name: 'Node.js version', status: 'fail', detail: 'Not found' });
    allPassed = false;
  }
}

// Check npm version
function checkNpm() {
  try {
    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    const major = parseInt(version.split('.')[0]);
    if (major >= 9) {
      checks.push({ name: 'npm version', status: 'pass', detail: version });
    } else {
      checks.push({ name: 'npm version', status: 'warn', detail: `${version} (recommend 9+)` });
    }
  } catch (e) {
    checks.push({ name: 'npm version', status: 'fail', detail: 'Not found' });
    allPassed = false;
  }
}

// Check Git configuration
function checkGit() {
  try {
    const name = execSync('git config user.name', { encoding: 'utf8' }).trim();
    const email = execSync('git config user.email', { encoding: 'utf8' }).trim();
    if (name && email) {
      checks.push({ name: 'Git config', status: 'pass', detail: `${name} <${email}>` });
    } else {
      checks.push({ name: 'Git config', status: 'fail', detail: 'Name or email not set' });
      allPassed = false;
    }
  } catch (e) {
    checks.push({ name: 'Git config', status: 'fail', detail: 'Git not configured' });
    allPassed = false;
  }
}

// Check if dependencies are installed
function checkDependencies() {
  const nodeModules = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModules)) {
    checks.push({ name: 'Dependencies', status: 'pass', detail: 'node_modules exists' });
  } else {
    checks.push({ name: 'Dependencies', status: 'fail', detail: 'Run npm install' });
    allPassed = false;
  }
}

// Check required files exist
function checkFiles() {
  const requiredFiles = ['package.json', 'README.md'];
  const missing = requiredFiles.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
  if (missing.length === 0) {
    checks.push({ name: 'Required files', status: 'pass', detail: 'All present' });
  } else {
    checks.push({ name: 'Required files', status: 'fail', detail: `Missing: ${missing.join(', ')}` });
    allPassed = false;
  }
}

// Run all checks
checkNode();
checkNpm();
checkGit();
checkDependencies();
checkFiles();

// Display results
console.log('\nResults:\n');
checks.forEach(check => {
  const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
  console.log(`${icon} ${check.name}: ${check.detail}`);
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  // Generate verification token
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  const token = `TASKMASTER-${random}-${timestamp.toString(36).toUpperCase()}`;

  console.log('\n🎉 All checks passed!\n');
  console.log('Your verification token:');
  console.log('\n  ' + token + '\n');
  console.log('Submit this token to complete Task 1.1');
  console.log('- Discord: /submit ' + token);
  console.log('- Web Portal: Tasks > Task 1.1 > Submit Token\n');
} else {
  console.log('\n❌ Some checks failed. Please fix the issues above and try again.\n');
  process.exit(1);
}
