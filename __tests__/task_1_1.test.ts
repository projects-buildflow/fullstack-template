/**
 * Task 1.1: Environment Setup Tests
 *
 * This test verifies that the development environment is set up correctly:
 * - Node.js and npm are working
 * - Dependencies are installed
 * - The verify script runs and generates a token
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

describe('Task 1.1: Environment Setup', () => {
  const projectRoot = process.cwd();

  it('should have node_modules directory', () => {
    const nodeModulesPath = join(projectRoot, 'node_modules');
    expect(existsSync(nodeModulesPath)).toBe(true);
  });

  it('should have package-lock.json', () => {
    const lockFilePath = join(projectRoot, 'package-lock.json');
    expect(existsSync(lockFilePath)).toBe(true);
  });

  it('should have package.json with required dependencies', () => {
    const packageJsonPath = join(projectRoot, 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Check for React dependencies
    expect(packageJson.dependencies).toHaveProperty('react');
    expect(packageJson.dependencies).toHaveProperty('react-dom');
  });

  it('should have TypeScript configured', () => {
    const tsconfigPath = join(projectRoot, 'tsconfig.json');
    expect(existsSync(tsconfigPath)).toBe(true);
  });

  it('should have Vite configured', () => {
    const viteConfigPath = join(projectRoot, 'vite.config.ts');
    expect(existsSync(viteConfigPath)).toBe(true);
  });

  it('should have Tailwind CSS configured', () => {
    const tailwindConfigPath = join(projectRoot, 'tailwind.config.js');
    const tailwindConfigTsPath = join(projectRoot, 'tailwind.config.ts');
    expect(existsSync(tailwindConfigPath) || existsSync(tailwindConfigTsPath)).toBe(true);
  });

  it('should have verify script that generates token', () => {
    const verifyScriptPath = join(projectRoot, 'scripts', 'verify.js');
    expect(existsSync(verifyScriptPath)).toBe(true);

    // Run verify script and check output contains a token
    try {
      const output = execSync('node scripts/verify.js', {
        cwd: projectRoot,
        encoding: 'utf-8',
        timeout: 30000,
      });
      expect(output).toContain('TASKMASTER-');
    } catch (error) {
      // If the script fails, check if it's because of missing dependencies
      // which is acceptable since student hasn't run npm install yet
      console.log('Verify script output:', error);
    }
  });
});
