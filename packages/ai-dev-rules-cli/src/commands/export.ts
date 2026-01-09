import chalk from 'chalk';
import ora from 'ora';
import { fetchCombinedRules, fetchFile } from '../utils/github.js';
import { allFormats, getFormatBySlug, getFormatSlugs } from '../formats/index.js';
import { verifyInstallation, printVerifyResults } from '../utils/verify.js';

export interface ExportOptions {
  format?: string;
  all?: boolean;
  verify?: boolean;
}

export async function exportRules(options: ExportOptions): Promise<void> {
  console.log('');
  console.log(chalk.bold('AI Dev Rules Export'));
  console.log('');

  if (options.all) {
    await exportAllFormats(options);
    return;
  }

  if (options.format) {
    await exportSingleFormat(options.format, options);
    return;
  }

  console.log(chalk.yellow('Bitte Format angeben: --format <format> oder --all'));
  console.log(`Verfügbare Formate: ${getFormatSlugs().join(', ')}`);
  process.exit(2);
}

async function exportSingleFormat(format: string, options: ExportOptions): Promise<void> {
  const handler = getFormatBySlug(format);
  
  if (!handler) {
    console.log(chalk.red(`Unbekanntes Format: ${format}`));
    console.log(`Verfügbar: ${getFormatSlugs().join(', ')}`);
    process.exit(2);
  }
  
  const spinner = ora(`Lade Rules für ${handler.name}...`).start();
  
  try {
    let content: string;
    
    if (format === 'agents') {
      content = await fetchFile('AGENTS.md');
    } else {
      content = await fetchCombinedRules();
    }
    
    const targetDir = process.cwd();
    const filePath = handler.write(content, targetDir);
    
    spinner.succeed(`${handler.name} exportiert`);
    console.log(chalk.dim(`  → ${filePath}`));
    
    if (options.verify !== false) {
      console.log('');
      const result = await verifyInstallation({
        checkFiles: [filePath]
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail('Fehler beim Export');
    console.error(chalk.red((error as Error).message));
    process.exit(3);
  }
}

async function exportAllFormats(options: ExportOptions): Promise<void> {
  const spinner = ora('Lade Rules...').start();
  
  try {
    const content = await fetchCombinedRules();
    const agentsContent = await fetchFile('AGENTS.md');
    const targetDir = process.cwd();
    const createdFiles: string[] = [];
    
    spinner.text = 'Exportiere zu allen Formaten...';
    
    for (const handler of allFormats) {
      const fileContent = handler.slug === 'agents' ? agentsContent : content;
      const filePath = handler.write(fileContent, targetDir);
      createdFiles.push(filePath);
    }
    
    spinner.succeed('Alle Formate exportiert');
    
    for (const file of createdFiles) {
      console.log(chalk.dim(`  → ${file}`));
    }
    
    if (options.verify !== false) {
      console.log('');
      const result = await verifyInstallation({
        checkFiles: createdFiles
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail('Fehler beim Export');
    console.error(chalk.red((error as Error).message));
    process.exit(3);
  }
}
