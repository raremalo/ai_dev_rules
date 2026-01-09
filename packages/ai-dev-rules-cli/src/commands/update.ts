import chalk from 'chalk';
import ora from 'ora';
import { fetchCombinedRules, fetchFile } from '../utils/github.js';
import { allFormats } from '../formats/index.js';
import { verifyInstallation, printVerifyResults } from '../utils/verify.js';
import fs from 'fs';
import path from 'path';

export interface UpdateOptions {
  verify?: boolean;
}

export async function update(options: UpdateOptions): Promise<void> {
  console.log('');
  console.log(chalk.bold('AI Dev Rules Update'));
  console.log('');

  const spinner = ora('Suche existierende Regel-Dateien...').start();
  const targetDir = process.cwd();
  const existingFiles: string[] = [];
  
  for (const handler of allFormats) {
    const filePath = path.join(targetDir, handler.filename);
    if (fs.existsSync(filePath)) {
      existingFiles.push(handler.slug);
    }
  }
  
  if (existingFiles.length === 0) {
    spinner.warn('Keine existierenden Regel-Dateien gefunden');
    console.log(chalk.dim('Führe "ai-dev-rules setup" aus um Rules zu installieren.'));
    return;
  }
  
  spinner.text = `Aktualisiere ${existingFiles.length} Datei(en)...`;
  
  try {
    const content = await fetchCombinedRules();
    const agentsContent = await fetchFile('AGENTS.md');
    const updatedFiles: string[] = [];
    
    for (const slug of existingFiles) {
      const handler = allFormats.find(f => f.slug === slug);
      if (handler) {
        const fileContent = slug === 'agents' ? agentsContent : content;
        const filePath = handler.write(fileContent, targetDir);
        updatedFiles.push(filePath);
      }
    }
    
    spinner.succeed(`${updatedFiles.length} Datei(en) aktualisiert`);
    
    for (const file of updatedFiles) {
      console.log(chalk.dim(`  → ${file}`));
    }
    
    if (options.verify !== false) {
      console.log('');
      const result = await verifyInstallation({
        checkFiles: updatedFiles
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail('Fehler beim Update');
    console.error(chalk.red((error as Error).message));
    process.exit(3);
  }
}
