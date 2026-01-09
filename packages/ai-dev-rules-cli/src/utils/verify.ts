import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export interface VerifyResult {
  success: boolean;
  checks: CheckResult[];
}

export interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  size?: number;
}

export async function verifyInstallation(options: {
  checkFiles?: string[];
  checkMCP?: boolean;
  mcpConfigPath?: string;
}): Promise<VerifyResult> {
  const checks: CheckResult[] = [];
  
  if (options.checkFiles) {
    for (const file of options.checkFiles) {
      const exists = fs.existsSync(file);
      const stats = exists ? fs.statSync(file) : null;
      
      checks.push({
        name: file,
        passed: exists && (stats?.size ?? 0) > 0,
        message: exists 
          ? `Erstellt (${formatSize(stats?.size ?? 0)})`
          : 'Nicht gefunden',
        size: stats?.size
      });
    }
  }
  
  if (options.checkMCP && options.mcpConfigPath) {
    const configExists = fs.existsSync(options.mcpConfigPath);
    let isValidJson = false;
    
    if (configExists) {
      try {
        const content = fs.readFileSync(options.mcpConfigPath, 'utf-8');
        JSON.parse(content);
        isValidJson = true;
      } catch {
        isValidJson = false;
      }
    }
    
    checks.push({
      name: 'MCP Config',
      passed: configExists && isValidJson,
      message: !configExists 
        ? 'Nicht gefunden'
        : isValidJson 
          ? 'Valides JSON'
          : 'Ungültiges JSON'
    });
    
    if (configExists && isValidJson) {
      try {
        await execAsync('npx -y agent-rules-mcp@latest --help', { timeout: 10000 });
        checks.push({
          name: 'agent-rules-mcp',
          passed: true,
          message: 'Erreichbar'
        });
      } catch {
        checks.push({
          name: 'agent-rules-mcp',
          passed: false,
          message: 'Nicht erreichbar (optional)'
        });
      }
    }
  }
  
  return {
    success: checks.every(c => c.passed),
    checks
  };
}

export function printVerifyResults(result: VerifyResult): void {
  console.log('');
  
  for (const check of result.checks) {
    const icon = check.passed ? chalk.green('✓') : chalk.red('✗');
    const name = check.passed ? check.name : chalk.red(check.name);
    console.log(`${icon} ${name} - ${check.message}`);
  }
  
  console.log('');
  console.log('─'.repeat(40));
  
  if (result.success) {
    console.log(chalk.green('Installation erfolgreich!'));
  } else {
    console.log(chalk.yellow('Installation abgeschlossen mit Warnungen.'));
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
