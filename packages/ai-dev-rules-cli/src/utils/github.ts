import https from 'https';
import http from 'http';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/raremalo/ai_dev_rules/master';
const GITHUB_API_BASE = 'https://api.github.com/repos/raremalo/ai_dev_rules';

export interface RuleFile {
  name: string;
  content: string;
}

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'ai-dev-rules-cli' } }, (res) => {
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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

export async function fetchRulesList(): Promise<string[]> {
  const response = await fetch(`${GITHUB_API_BASE}/contents/rules`);
  const files = JSON.parse(response) as Array<{ name: string; type: string }>;
  return files
    .filter(f => f.type === 'file' && f.name.endsWith('.md'))
    .map(f => f.name)
    .sort();
}

export async function fetchRule(filename: string): Promise<string> {
  return fetch(`${GITHUB_RAW_BASE}/rules/${filename}`);
}

export async function fetchAllRules(): Promise<RuleFile[]> {
  const files = await fetchRulesList();
  const rules: RuleFile[] = [];
  
  for (const name of files) {
    const content = await fetchRule(name);
    rules.push({ name, content });
  }
  
  return rules;
}

export async function fetchCombinedRules(): Promise<string> {
  const rules = await fetchAllRules();
  return rules.map(r => r.content).join('\n\n---\n\n');
}

export async function fetchFile(path: string): Promise<string> {
  return fetch(`${GITHUB_RAW_BASE}/${path}`);
}

export function getGitHubRepoUrl(): string {
  return 'https://github.com/raremalo/ai_dev_rules';
}
