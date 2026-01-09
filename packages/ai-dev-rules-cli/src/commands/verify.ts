import chalk from 'chalk';
import { getMCPConfigPath } from '../utils/config.js';
import { allFormats } from '../formats/index.js';
import { verifyInstallation, printVerifyResults } from '../utils/verify.js';
import fs from 'fs';
import path from 'path';

export async function verify(): Promise<void> {
  console.log('');
  console.log(chalk.bold('AI Dev Rules Verify'));
  console.log('');

  const targetDir = process.cwd();
  const existingFiles: string[] = [];
  
  for (const handler of allFormats) {
    const filePath = path.join(targetDir, handler.filename);
    if (fs.existsSync(filePath)) {
      existingFiles.push(filePath);
    }
  }
  
  const mcpConfigPath = getMCPConfigPath();
  
  const result = await verifyInstallation({
    checkFiles: existingFiles,
    checkMCP: !!mcpConfigPath,
    mcpConfigPath: mcpConfigPath || undefined
  });
  
  printVerifyResults(result);
  
  if (!result.success) {
    process.exit(5);
  }
}
