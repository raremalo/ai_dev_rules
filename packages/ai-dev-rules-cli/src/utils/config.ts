import fs from 'fs';
import path from 'path';
import os from 'os';

export interface MCPServerConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
  disabled?: boolean;
}

export interface MCPConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

export function getMCPConfigPath(): string | null {
  const platform = os.platform();
  
  if (platform === 'darwin') {
    const cursorPath = path.join(os.homedir(), '.cursor', 'mcp.json');
    if (fs.existsSync(path.dirname(cursorPath))) {
      return cursorPath;
    }
    
    const claudePath = path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Claude',
      'claude_desktop_config.json'
    );
    if (fs.existsSync(path.dirname(claudePath))) {
      return claudePath;
    }
  } else if (platform === 'win32') {
    const cursorPath = path.join(os.homedir(), '.cursor', 'mcp.json');
    if (fs.existsSync(path.dirname(cursorPath))) {
      return cursorPath;
    }
    
    const claudePath = path.join(
      process.env.APPDATA || '',
      'Claude',
      'claude_desktop_config.json'
    );
    if (fs.existsSync(path.dirname(claudePath))) {
      return claudePath;
    }
  } else {
    const cursorPath = path.join(os.homedir(), '.cursor', 'mcp.json');
    if (fs.existsSync(path.dirname(cursorPath))) {
      return cursorPath;
    }
  }
  
  return null;
}

export function getDefaultMCPConfig(): MCPConfig {
  return {
    mcpServers: {
      'ai-dev-rules': {
        command: 'npx',
        args: ['-y', 'agent-rules-mcp@latest'],
        env: {
          GITHUB_OWNER: 'raremalo',
          GITHUB_REPO: 'ai_dev_rules',
          GITHUB_PATH: 'rules',
          GITHUB_BRANCH: 'master'
        }
      },
      'ai-skills': {
        command: 'npx',
        args: ['-y', 'agent-rules-mcp@latest'],
        env: {
          GITHUB_OWNER: 'raremalo',
          GITHUB_REPO: 'ai_dev_rules',
          GITHUB_PATH: 'skills',
          GITHUB_BRANCH: 'master'
        }
      }
    }
  };
}

export function readMCPConfig(configPath: string): MCPConfig | null {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content) as MCPConfig;
  } catch {
    return null;
  }
}

export function writeMCPConfig(configPath: string, config: MCPConfig): void {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function mergeMCPConfig(existing: MCPConfig, newConfig: MCPConfig): MCPConfig {
  return {
    mcpServers: {
      ...existing.mcpServers,
      ...newConfig.mcpServers
    }
  };
}

export function backupConfig(configPath: string): string | null {
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  const backupPath = `${configPath}.backup.${Date.now()}`;
  fs.copyFileSync(configPath, backupPath);
  return backupPath;
}
