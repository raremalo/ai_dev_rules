import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { fetchCombinedRules, fetchFile } from '../utils/github.js';
import { 
  getMCPConfigPath, 
  getDefaultMCPConfig, 
  readMCPConfig, 
  writeMCPConfig, 
  mergeMCPConfig,
  backupConfig 
} from '../utils/config.js';
import { allFormats, getFormatBySlug, getFormatSlugs } from '../formats/index.js';
import { verifyInstallation, printVerifyResults } from '../utils/verify.js';

export interface SetupOptions {
  format?: string;
  mcp?: boolean;
  all?: boolean;
  verify?: boolean;
  yes?: boolean;
}

export async function setup(options: SetupOptions): Promise<void> {
  console.log('');
  console.log(chalk.bold('AI Dev Rules Setup'));
  console.log('');

  if (options.mcp) {
    await setupMCP(options);
    return;
  }

  if (options.format) {
    await exportFormat(options.format, options);
    return;
  }

  if (options.all) {
    await exportAllFormats(options);
    return;
  }

  const response = await prompts([
    {
      type: 'select',
      name: 'action',
      message: 'Was möchtest du einrichten?',
      choices: [
        { title: 'MCP Server (Cursor, Claude Desktop, Kiro)', value: 'mcp' },
        { title: 'Ein IDE-Format exportieren', value: 'single' },
        { title: 'Alle IDE-Formate exportieren', value: 'all' }
      ]
    }
  ]);

  if (response.action === 'mcp') {
    await setupMCP(options);
  } else if (response.action === 'single') {
    const formatResponse = await prompts({
      type: 'select',
      name: 'format',
      message: 'Welches Format?',
      choices: allFormats.map(f => ({
        title: `${f.name} (${f.filename})`,
        value: f.slug
      }))
    });
    await exportFormat(formatResponse.format, options);
  } else if (response.action === 'all') {
    await exportAllFormats(options);
  }
}

async function setupMCP(options: SetupOptions): Promise<void> {
  const spinner = ora('Suche MCP-Konfiguration...').start();
  
  let configPath = getMCPConfigPath();
  
  if (!configPath) {
    spinner.stop();
    const response = await prompts({
      type: 'text',
      name: 'path',
      message: 'Kein MCP-Client gefunden. Pfad zur Config-Datei:',
      initial: '~/.cursor/mcp.json'
    });
    configPath = response.path.replace('~', process.env.HOME || '');
  }

  spinner.text = 'Erstelle MCP-Konfiguration...';
  
  const existingConfig = readMCPConfig(configPath);
  const newConfig = getDefaultMCPConfig();
  
  if (existingConfig && !options.yes) {
    spinner.stop();
    const backup = await prompts({
      type: 'confirm',
      name: 'merge',
      message: 'Existierende Config gefunden. Zusammenführen?',
      initial: true
    });
    
    if (backup.merge) {
      const backupPath = backupConfig(configPath);
      if (backupPath) {
        console.log(chalk.dim(`Backup: ${backupPath}`));
      }
      const merged = mergeMCPConfig(existingConfig, newConfig);
      writeMCPConfig(configPath, merged);
    } else {
      console.log(chalk.yellow('Abgebrochen.'));
      return;
    }
    spinner.start();
  } else {
    if (existingConfig) {
      const backupPath = backupConfig(configPath);
      if (backupPath) {
        console.log(chalk.dim(`Backup: ${backupPath}`));
      }
      const merged = mergeMCPConfig(existingConfig, newConfig);
      writeMCPConfig(configPath, merged);
    } else {
      writeMCPConfig(configPath, newConfig);
    }
  }
  
  spinner.succeed('MCP-Konfiguration erstellt');
  console.log(chalk.dim(`  → ${configPath}`));
  console.log('');
  console.log(chalk.yellow('Bitte IDE neu starten um MCP-Server zu aktivieren.'));
  
  if (options.verify !== false) {
    console.log('');
    const result = await verifyInstallation({
      checkMCP: true,
      mcpConfigPath: configPath
    });
    printVerifyResults(result);
  }
}

async function exportFormat(format: string, options: SetupOptions): Promise<void> {
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

async function exportAllFormats(options: SetupOptions): Promise<void> {
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
