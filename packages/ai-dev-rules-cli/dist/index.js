#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/commands/setup.ts
import chalk2 from "chalk";
import ora from "ora";
import prompts from "prompts";

// src/utils/github.ts
import https from "https";
import http from "http";
var GITHUB_RAW_BASE = "https://raw.githubusercontent.com/raremalo/ai_dev_rules/master";
var GITHUB_API_BASE = "https://api.github.com/repos/raremalo/ai_dev_rules";
function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "ai-dev-rules-cli" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) {
          fetch(res.headers.location).then(resolve).catch(reject);
          return;
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}
async function fetchRulesList() {
  const response = await fetch(`${GITHUB_API_BASE}/contents/rules`);
  const files = JSON.parse(response);
  return files.filter((f) => f.type === "file" && f.name.endsWith(".md")).map((f) => f.name).sort();
}
async function fetchRule(filename) {
  return fetch(`${GITHUB_RAW_BASE}/rules/${filename}`);
}
async function fetchAllRules() {
  const files = await fetchRulesList();
  const rules = [];
  for (const name of files) {
    const content = await fetchRule(name);
    rules.push({ name, content });
  }
  return rules;
}
async function fetchCombinedRules() {
  const rules = await fetchAllRules();
  return rules.map((r) => r.content).join("\n\n---\n\n");
}
async function fetchFile(path5) {
  return fetch(`${GITHUB_RAW_BASE}/${path5}`);
}

// src/utils/config.ts
import fs from "fs";
import path from "path";
import os from "os";
function getMCPConfigPath() {
  const platform = os.platform();
  if (platform === "darwin") {
    const cursorPath = path.join(os.homedir(), ".cursor", "mcp.json");
    if (fs.existsSync(path.dirname(cursorPath))) {
      return cursorPath;
    }
    const claudePath = path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "Claude",
      "claude_desktop_config.json"
    );
    if (fs.existsSync(path.dirname(claudePath))) {
      return claudePath;
    }
  } else if (platform === "win32") {
    const cursorPath = path.join(os.homedir(), ".cursor", "mcp.json");
    if (fs.existsSync(path.dirname(cursorPath))) {
      return cursorPath;
    }
    const claudePath = path.join(
      process.env.APPDATA || "",
      "Claude",
      "claude_desktop_config.json"
    );
    if (fs.existsSync(path.dirname(claudePath))) {
      return claudePath;
    }
  } else {
    const cursorPath = path.join(os.homedir(), ".cursor", "mcp.json");
    if (fs.existsSync(path.dirname(cursorPath))) {
      return cursorPath;
    }
  }
  return null;
}
function getDefaultMCPConfig() {
  return {
    mcpServers: {
      "ai-dev-rules": {
        command: "npx",
        args: ["-y", "agent-rules-mcp@latest"],
        env: {
          GITHUB_OWNER: "raremalo",
          GITHUB_REPO: "ai_dev_rules",
          GITHUB_PATH: "rules",
          GITHUB_BRANCH: "master"
        }
      },
      "ai-skills": {
        command: "npx",
        args: ["-y", "agent-rules-mcp@latest"],
        env: {
          GITHUB_OWNER: "raremalo",
          GITHUB_REPO: "ai_dev_rules",
          GITHUB_PATH: "skills",
          GITHUB_BRANCH: "master"
        }
      }
    }
  };
}
function readMCPConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}
function writeMCPConfig(configPath, config) {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
function mergeMCPConfig(existing, newConfig) {
  return {
    mcpServers: {
      ...existing.mcpServers,
      ...newConfig.mcpServers
    }
  };
}
function backupConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const backupPath = `${configPath}.backup.${Date.now()}`;
  fs.copyFileSync(configPath, backupPath);
  return backupPath;
}

// src/formats/index.ts
import fs2 from "fs";
import path2 from "path";
var cursorFormat = {
  name: "Cursor",
  slug: "cursor",
  filename: ".cursorrules",
  description: "Cursor IDE rules file",
  write(content, targetDir) {
    const filePath = path2.join(targetDir, this.filename);
    fs2.writeFileSync(filePath, content);
    return filePath;
  }
};
var copilotFormat = {
  name: "GitHub Copilot",
  slug: "copilot",
  filename: ".github/copilot-instructions.md",
  description: "GitHub Copilot instructions",
  write(content, targetDir) {
    const filePath = path2.join(targetDir, this.filename);
    const dir = path2.dirname(filePath);
    if (!fs2.existsSync(dir)) {
      fs2.mkdirSync(dir, { recursive: true });
    }
    fs2.writeFileSync(filePath, content);
    return filePath;
  }
};
var claudeFormat = {
  name: "Claude",
  slug: "claude",
  filename: "CLAUDE.md",
  description: "Claude AI memory file",
  write(content, targetDir) {
    const filePath = path2.join(targetDir, this.filename);
    fs2.writeFileSync(filePath, content);
    return filePath;
  }
};
var windsurfFormat = {
  name: "Windsurf",
  slug: "windsurf",
  filename: ".windsurfrules",
  description: "Windsurf IDE rules file",
  write(content, targetDir) {
    const filePath = path2.join(targetDir, this.filename);
    fs2.writeFileSync(filePath, content);
    return filePath;
  }
};
var zedFormat = {
  name: "Zed",
  slug: "zed",
  filename: ".zed/rules.md",
  description: "Zed editor rules",
  write(content, targetDir) {
    const filePath = path2.join(targetDir, this.filename);
    const dir = path2.dirname(filePath);
    if (!fs2.existsSync(dir)) {
      fs2.mkdirSync(dir, { recursive: true });
    }
    fs2.writeFileSync(filePath, content);
    return filePath;
  }
};
var clineFormat = {
  name: "Cline",
  slug: "cline",
  filename: ".clinerules",
  description: "Cline VS Code extension rules",
  write(content, targetDir) {
    const filePath = path2.join(targetDir, this.filename);
    fs2.writeFileSync(filePath, content);
    return filePath;
  }
};
var agentsFormat = {
  name: "AGENTS.md",
  slug: "agents",
  filename: "AGENTS.md",
  description: "Universal AI agent instructions",
  write(content, targetDir) {
    const filePath = path2.join(targetDir, this.filename);
    fs2.writeFileSync(filePath, content);
    return filePath;
  }
};
var allFormats = [
  cursorFormat,
  copilotFormat,
  claudeFormat,
  windsurfFormat,
  zedFormat,
  clineFormat,
  agentsFormat
];
function getFormatBySlug(slug) {
  return allFormats.find((f) => f.slug === slug);
}
function getFormatSlugs() {
  return allFormats.map((f) => f.slug);
}

// src/utils/verify.ts
import fs3 from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
var execAsync = promisify(exec);
async function verifyInstallation(options) {
  const checks = [];
  if (options.checkFiles) {
    for (const file of options.checkFiles) {
      const exists = fs3.existsSync(file);
      const stats = exists ? fs3.statSync(file) : null;
      checks.push({
        name: file,
        passed: exists && (stats?.size ?? 0) > 0,
        message: exists ? `Erstellt (${formatSize(stats?.size ?? 0)})` : "Nicht gefunden",
        size: stats?.size
      });
    }
  }
  if (options.checkMCP && options.mcpConfigPath) {
    const configExists = fs3.existsSync(options.mcpConfigPath);
    let isValidJson = false;
    if (configExists) {
      try {
        const content = fs3.readFileSync(options.mcpConfigPath, "utf-8");
        JSON.parse(content);
        isValidJson = true;
      } catch {
        isValidJson = false;
      }
    }
    checks.push({
      name: "MCP Config",
      passed: configExists && isValidJson,
      message: !configExists ? "Nicht gefunden" : isValidJson ? "Valides JSON" : "Ung\xFCltiges JSON"
    });
    if (configExists && isValidJson) {
      try {
        await execAsync("npx -y agent-rules-mcp@latest --help", { timeout: 1e4 });
        checks.push({
          name: "agent-rules-mcp",
          passed: true,
          message: "Erreichbar"
        });
      } catch {
        checks.push({
          name: "agent-rules-mcp",
          passed: false,
          message: "Nicht erreichbar (optional)"
        });
      }
    }
  }
  return {
    success: checks.every((c) => c.passed),
    checks
  };
}
function printVerifyResults(result) {
  console.log("");
  for (const check of result.checks) {
    const icon = check.passed ? chalk.green("\u2713") : chalk.red("\u2717");
    const name = check.passed ? check.name : chalk.red(check.name);
    console.log(`${icon} ${name} - ${check.message}`);
  }
  console.log("");
  console.log("\u2500".repeat(40));
  if (result.success) {
    console.log(chalk.green("Installation erfolgreich!"));
  } else {
    console.log(chalk.yellow("Installation abgeschlossen mit Warnungen."));
  }
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// src/commands/setup.ts
async function setup(options) {
  console.log("");
  console.log(chalk2.bold("AI Dev Rules Setup"));
  console.log("");
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
      type: "select",
      name: "action",
      message: "Was m\xF6chtest du einrichten?",
      choices: [
        { title: "MCP Server (Cursor, Claude Desktop, Kiro)", value: "mcp" },
        { title: "Ein IDE-Format exportieren", value: "single" },
        { title: "Alle IDE-Formate exportieren", value: "all" }
      ]
    }
  ]);
  if (response.action === "mcp") {
    await setupMCP(options);
  } else if (response.action === "single") {
    const formatResponse = await prompts({
      type: "select",
      name: "format",
      message: "Welches Format?",
      choices: allFormats.map((f) => ({
        title: `${f.name} (${f.filename})`,
        value: f.slug
      }))
    });
    await exportFormat(formatResponse.format, options);
  } else if (response.action === "all") {
    await exportAllFormats(options);
  }
}
async function setupMCP(options) {
  const spinner = ora("Suche MCP-Konfiguration...").start();
  let configPath = getMCPConfigPath();
  if (!configPath) {
    spinner.stop();
    const response = await prompts({
      type: "text",
      name: "path",
      message: "Kein MCP-Client gefunden. Pfad zur Config-Datei:",
      initial: "~/.cursor/mcp.json"
    });
    configPath = response.path.replace("~", process.env.HOME || "");
  }
  spinner.text = "Erstelle MCP-Konfiguration...";
  const existingConfig = readMCPConfig(configPath);
  const newConfig = getDefaultMCPConfig();
  if (existingConfig && !options.yes) {
    spinner.stop();
    const backup = await prompts({
      type: "confirm",
      name: "merge",
      message: "Existierende Config gefunden. Zusammenf\xFChren?",
      initial: true
    });
    if (backup.merge) {
      const backupPath = backupConfig(configPath);
      if (backupPath) {
        console.log(chalk2.dim(`Backup: ${backupPath}`));
      }
      const merged = mergeMCPConfig(existingConfig, newConfig);
      writeMCPConfig(configPath, merged);
    } else {
      console.log(chalk2.yellow("Abgebrochen."));
      return;
    }
    spinner.start();
  } else {
    if (existingConfig) {
      const backupPath = backupConfig(configPath);
      if (backupPath) {
        console.log(chalk2.dim(`Backup: ${backupPath}`));
      }
      const merged = mergeMCPConfig(existingConfig, newConfig);
      writeMCPConfig(configPath, merged);
    } else {
      writeMCPConfig(configPath, newConfig);
    }
  }
  spinner.succeed("MCP-Konfiguration erstellt");
  console.log(chalk2.dim(`  \u2192 ${configPath}`));
  console.log("");
  console.log(chalk2.yellow("Bitte IDE neu starten um MCP-Server zu aktivieren."));
  if (options.verify !== false) {
    console.log("");
    const result = await verifyInstallation({
      checkMCP: true,
      mcpConfigPath: configPath
    });
    printVerifyResults(result);
  }
}
async function exportFormat(format, options) {
  const handler = getFormatBySlug(format);
  if (!handler) {
    console.log(chalk2.red(`Unbekanntes Format: ${format}`));
    console.log(`Verf\xFCgbar: ${getFormatSlugs().join(", ")}`);
    process.exit(2);
  }
  const spinner = ora(`Lade Rules f\xFCr ${handler.name}...`).start();
  try {
    let content;
    if (format === "agents") {
      content = await fetchFile("AGENTS.md");
    } else {
      content = await fetchCombinedRules();
    }
    const targetDir = process.cwd();
    const filePath = handler.write(content, targetDir);
    spinner.succeed(`${handler.name} exportiert`);
    console.log(chalk2.dim(`  \u2192 ${filePath}`));
    if (options.verify !== false) {
      console.log("");
      const result = await verifyInstallation({
        checkFiles: [filePath]
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail("Fehler beim Export");
    console.error(chalk2.red(error.message));
    process.exit(3);
  }
}
async function exportAllFormats(options) {
  const spinner = ora("Lade Rules...").start();
  try {
    const content = await fetchCombinedRules();
    const agentsContent = await fetchFile("AGENTS.md");
    const targetDir = process.cwd();
    const createdFiles = [];
    spinner.text = "Exportiere zu allen Formaten...";
    for (const handler of allFormats) {
      const fileContent = handler.slug === "agents" ? agentsContent : content;
      const filePath = handler.write(fileContent, targetDir);
      createdFiles.push(filePath);
    }
    spinner.succeed("Alle Formate exportiert");
    for (const file of createdFiles) {
      console.log(chalk2.dim(`  \u2192 ${file}`));
    }
    if (options.verify !== false) {
      console.log("");
      const result = await verifyInstallation({
        checkFiles: createdFiles
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail("Fehler beim Export");
    console.error(chalk2.red(error.message));
    process.exit(3);
  }
}

// src/commands/export.ts
import chalk3 from "chalk";
import ora2 from "ora";
async function exportRules(options) {
  console.log("");
  console.log(chalk3.bold("AI Dev Rules Export"));
  console.log("");
  if (options.all) {
    await exportAllFormats2(options);
    return;
  }
  if (options.format) {
    await exportSingleFormat(options.format, options);
    return;
  }
  console.log(chalk3.yellow("Bitte Format angeben: --format <format> oder --all"));
  console.log(`Verf\xFCgbare Formate: ${getFormatSlugs().join(", ")}`);
  process.exit(2);
}
async function exportSingleFormat(format, options) {
  const handler = getFormatBySlug(format);
  if (!handler) {
    console.log(chalk3.red(`Unbekanntes Format: ${format}`));
    console.log(`Verf\xFCgbar: ${getFormatSlugs().join(", ")}`);
    process.exit(2);
  }
  const spinner = ora2(`Lade Rules f\xFCr ${handler.name}...`).start();
  try {
    let content;
    if (format === "agents") {
      content = await fetchFile("AGENTS.md");
    } else {
      content = await fetchCombinedRules();
    }
    const targetDir = process.cwd();
    const filePath = handler.write(content, targetDir);
    spinner.succeed(`${handler.name} exportiert`);
    console.log(chalk3.dim(`  \u2192 ${filePath}`));
    if (options.verify !== false) {
      console.log("");
      const result = await verifyInstallation({
        checkFiles: [filePath]
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail("Fehler beim Export");
    console.error(chalk3.red(error.message));
    process.exit(3);
  }
}
async function exportAllFormats2(options) {
  const spinner = ora2("Lade Rules...").start();
  try {
    const content = await fetchCombinedRules();
    const agentsContent = await fetchFile("AGENTS.md");
    const targetDir = process.cwd();
    const createdFiles = [];
    spinner.text = "Exportiere zu allen Formaten...";
    for (const handler of allFormats) {
      const fileContent = handler.slug === "agents" ? agentsContent : content;
      const filePath = handler.write(fileContent, targetDir);
      createdFiles.push(filePath);
    }
    spinner.succeed("Alle Formate exportiert");
    for (const file of createdFiles) {
      console.log(chalk3.dim(`  \u2192 ${file}`));
    }
    if (options.verify !== false) {
      console.log("");
      const result = await verifyInstallation({
        checkFiles: createdFiles
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail("Fehler beim Export");
    console.error(chalk3.red(error.message));
    process.exit(3);
  }
}

// src/commands/update.ts
import chalk4 from "chalk";
import ora3 from "ora";
import fs4 from "fs";
import path3 from "path";
async function update(options) {
  console.log("");
  console.log(chalk4.bold("AI Dev Rules Update"));
  console.log("");
  const spinner = ora3("Suche existierende Regel-Dateien...").start();
  const targetDir = process.cwd();
  const existingFiles = [];
  for (const handler of allFormats) {
    const filePath = path3.join(targetDir, handler.filename);
    if (fs4.existsSync(filePath)) {
      existingFiles.push(handler.slug);
    }
  }
  if (existingFiles.length === 0) {
    spinner.warn("Keine existierenden Regel-Dateien gefunden");
    console.log(chalk4.dim('F\xFChre "ai-dev-rules setup" aus um Rules zu installieren.'));
    return;
  }
  spinner.text = `Aktualisiere ${existingFiles.length} Datei(en)...`;
  try {
    const content = await fetchCombinedRules();
    const agentsContent = await fetchFile("AGENTS.md");
    const updatedFiles = [];
    for (const slug of existingFiles) {
      const handler = allFormats.find((f) => f.slug === slug);
      if (handler) {
        const fileContent = slug === "agents" ? agentsContent : content;
        const filePath = handler.write(fileContent, targetDir);
        updatedFiles.push(filePath);
      }
    }
    spinner.succeed(`${updatedFiles.length} Datei(en) aktualisiert`);
    for (const file of updatedFiles) {
      console.log(chalk4.dim(`  \u2192 ${file}`));
    }
    if (options.verify !== false) {
      console.log("");
      const result = await verifyInstallation({
        checkFiles: updatedFiles
      });
      printVerifyResults(result);
    }
  } catch (error) {
    spinner.fail("Fehler beim Update");
    console.error(chalk4.red(error.message));
    process.exit(3);
  }
}

// src/commands/verify.ts
import chalk5 from "chalk";
import fs5 from "fs";
import path4 from "path";
async function verify() {
  console.log("");
  console.log(chalk5.bold("AI Dev Rules Verify"));
  console.log("");
  const targetDir = process.cwd();
  const existingFiles = [];
  for (const handler of allFormats) {
    const filePath = path4.join(targetDir, handler.filename);
    if (fs5.existsSync(filePath)) {
      existingFiles.push(filePath);
    }
  }
  const mcpConfigPath = getMCPConfigPath();
  const result = await verifyInstallation({
    checkFiles: existingFiles,
    checkMCP: !!mcpConfigPath,
    mcpConfigPath: mcpConfigPath || void 0
  });
  printVerifyResults(result);
  if (!result.success) {
    process.exit(5);
  }
}

// src/index.ts
var program = new Command();
program.name("ai-dev-rules").description("Universal AI development rules installer for all IDEs").version("1.0.0");
program.command("setup").description("Interactive setup wizard").option("-f, --format <format>", `Export to specific format (${getFormatSlugs().join(", ")})`).option("-m, --mcp", "Setup MCP configuration").option("-a, --all", "Export to all formats").option("-y, --yes", "Auto-confirm all prompts").option("--no-verify", "Skip verification").action(setup);
program.command("export").description("Export rules to IDE format").option("-f, --format <format>", `Format to export (${getFormatSlugs().join(", ")})`).option("-a, --all", "Export to all formats").option("--no-verify", "Skip verification").action(exportRules);
program.command("update").description("Update existing rule files").option("--no-verify", "Skip verification").action(update);
program.command("verify").description("Verify installation").action(verify);
program.parse();
