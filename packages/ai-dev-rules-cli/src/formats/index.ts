import fs from 'fs';
import path from 'path';

export interface FormatHandler {
  name: string;
  slug: string;
  filename: string;
  description: string;
  write(content: string, targetDir: string): string;
}

export const cursorFormat: FormatHandler = {
  name: 'Cursor',
  slug: 'cursor',
  filename: '.cursorrules',
  description: 'Cursor IDE rules file',
  write(content: string, targetDir: string): string {
    const filePath = path.join(targetDir, this.filename);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
};

export const copilotFormat: FormatHandler = {
  name: 'GitHub Copilot',
  slug: 'copilot',
  filename: '.github/copilot-instructions.md',
  description: 'GitHub Copilot instructions',
  write(content: string, targetDir: string): string {
    const filePath = path.join(targetDir, this.filename);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    return filePath;
  }
};

export const claudeFormat: FormatHandler = {
  name: 'Claude',
  slug: 'claude',
  filename: 'CLAUDE.md',
  description: 'Claude AI memory file',
  write(content: string, targetDir: string): string {
    const filePath = path.join(targetDir, this.filename);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
};

export const windsurfFormat: FormatHandler = {
  name: 'Windsurf',
  slug: 'windsurf',
  filename: '.windsurfrules',
  description: 'Windsurf IDE rules file',
  write(content: string, targetDir: string): string {
    const filePath = path.join(targetDir, this.filename);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
};

export const zedFormat: FormatHandler = {
  name: 'Zed',
  slug: 'zed',
  filename: '.zed/rules.md',
  description: 'Zed editor rules',
  write(content: string, targetDir: string): string {
    const filePath = path.join(targetDir, this.filename);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    return filePath;
  }
};

export const clineFormat: FormatHandler = {
  name: 'Cline',
  slug: 'cline',
  filename: '.clinerules',
  description: 'Cline VS Code extension rules',
  write(content: string, targetDir: string): string {
    const filePath = path.join(targetDir, this.filename);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
};

export const agentsFormat: FormatHandler = {
  name: 'AGENTS.md',
  slug: 'agents',
  filename: 'AGENTS.md',
  description: 'Universal AI agent instructions',
  write(content: string, targetDir: string): string {
    const filePath = path.join(targetDir, this.filename);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
};

export const allFormats: FormatHandler[] = [
  cursorFormat,
  copilotFormat,
  claudeFormat,
  windsurfFormat,
  zedFormat,
  clineFormat,
  agentsFormat
];

export function getFormatBySlug(slug: string): FormatHandler | undefined {
  return allFormats.find(f => f.slug === slug);
}

export function getFormatSlugs(): string[] {
  return allFormats.map(f => f.slug);
}
