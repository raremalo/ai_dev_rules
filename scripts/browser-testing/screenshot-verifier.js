/**
 * Screenshot Verifier Script
 *
 * Verwaltet Screenshot-Verifikation fuer TDD-Loop Pattern.
 * Liest/aktualisiert manifest.json und prueft Completion-Bedingungen.
 *
 * @usage In Node.js oder als CLI-Tool
 * @version 1.0
 * @lastUpdated 2025-01-10
 */

const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = process.env.SCREENSHOTS_DIR || './screenshots';
const MANIFEST_PATH = path.join(SCREENSHOTS_DIR, 'manifest.json');

/**
 * Initialisiert die Screenshot-Verzeichnisstruktur
 */
function initializeStructure() {
  const dirs = [
    SCREENSHOTS_DIR,
    path.join(SCREENSHOTS_DIR, 'pending'),
    path.join(SCREENSHOTS_DIR, 'verified')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  if (!fs.existsSync(MANIFEST_PATH)) {
    const initialManifest = {
      screenshots: [],
      allVerified: true,
      totalCount: 0,
      verifiedCount: 0,
      pendingCount: 0,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(initialManifest, null, 2));
  }

  return { success: true, message: 'Structure initialized' };
}

/**
 * Liest das aktuelle Manifest
 */
function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    initializeStructure();
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

/**
 * Schreibt das Manifest
 */
function writeManifest(manifest) {
  manifest.lastUpdated = new Date().toISOString();
  manifest.totalCount = manifest.screenshots.length;
  manifest.verifiedCount = manifest.screenshots.filter(s => s.status === 'verified').length;
  manifest.pendingCount = manifest.screenshots.filter(s => s.status === 'pending').length;
  manifest.allVerified = manifest.pendingCount === 0 && manifest.totalCount > 0;

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  return manifest;
}

/**
 * Registriert einen neuen Screenshot als pending
 */
function registerScreenshot(id, filePath, feature, metadata = {}) {
  const manifest = readManifest();

  // Pruefe ob bereits existiert
  const existing = manifest.screenshots.find(s => s.id === id);
  if (existing) {
    return { success: false, message: `Screenshot ${id} already exists`, screenshot: existing };
  }

  const screenshot = {
    id,
    path: filePath,
    status: 'pending',
    feature,
    timestamp: new Date().toISOString(),
    ...metadata
  };

  manifest.screenshots.push(screenshot);
  writeManifest(manifest);

  return { success: true, message: `Screenshot ${id} registered`, screenshot };
}

/**
 * Markiert einen Screenshot als verified
 */
function verifyScreenshot(id, verifiedBy = 'claude') {
  const manifest = readManifest();

  const screenshot = manifest.screenshots.find(s => s.id === id);
  if (!screenshot) {
    return { success: false, message: `Screenshot ${id} not found` };
  }

  if (screenshot.status === 'verified') {
    return { success: true, message: `Screenshot ${id} already verified`, screenshot };
  }

  // Update status
  screenshot.status = 'verified';
  screenshot.verifiedAt = new Date().toISOString();
  screenshot.verifiedBy = verifiedBy;

  // Optional: Datei in verified-Ordner verschieben
  const oldPath = path.join(SCREENSHOTS_DIR, screenshot.path);
  const newFileName = screenshot.id + '-verified' + path.extname(screenshot.path);
  const newPath = path.join(SCREENSHOTS_DIR, 'verified', newFileName);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    screenshot.path = path.join('verified', newFileName);
  }

  writeManifest(manifest);

  return { success: true, message: `Screenshot ${id} verified`, screenshot };
}

/**
 * Prueft ob Completion erlaubt ist
 */
function checkCompletionAllowed() {
  const manifest = readManifest();

  const result = {
    allowed: manifest.allVerified,
    totalCount: manifest.totalCount,
    verifiedCount: manifest.verifiedCount,
    pendingCount: manifest.pendingCount,
    pendingScreenshots: manifest.screenshots
      .filter(s => s.status === 'pending')
      .map(s => s.id)
  };

  if (!result.allowed) {
    result.reason = result.totalCount === 0
      ? 'No screenshots registered'
      : `${result.pendingCount} screenshot(s) still pending: ${result.pendingScreenshots.join(', ')}`;
  }

  return result;
}

/**
 * Gibt Status-Zusammenfassung zurueck
 */
function getStatus() {
  const manifest = readManifest();

  return {
    allVerified: manifest.allVerified,
    totalCount: manifest.totalCount,
    verifiedCount: manifest.verifiedCount,
    pendingCount: manifest.pendingCount,
    lastUpdated: manifest.lastUpdated,
    screenshots: manifest.screenshots.map(s => ({
      id: s.id,
      status: s.status,
      feature: s.feature
    }))
  };
}

/**
 * Listet alle pending Screenshots
 */
function listPending() {
  const manifest = readManifest();
  return manifest.screenshots.filter(s => s.status === 'pending');
}

/**
 * Listet alle verified Screenshots
 */
function listVerified() {
  const manifest = readManifest();
  return manifest.screenshots.filter(s => s.status === 'verified');
}

/**
 * Setzt das Manifest zurueck (fuer neuen Test-Run)
 */
function reset() {
  const manifest = {
    screenshots: [],
    allVerified: true,
    totalCount: 0,
    verifiedCount: 0,
    pendingCount: 0,
    lastUpdated: new Date().toISOString()
  };

  writeManifest(manifest);
  return { success: true, message: 'Manifest reset' };
}

// CLI Support
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      console.log(JSON.stringify(initializeStructure(), null, 2));
      break;
    case 'status':
      console.log(JSON.stringify(getStatus(), null, 2));
      break;
    case 'check':
      console.log(JSON.stringify(checkCompletionAllowed(), null, 2));
      break;
    case 'register':
      if (args.length < 4) {
        console.log('Usage: register <id> <path> <feature>');
        process.exit(1);
      }
      console.log(JSON.stringify(registerScreenshot(args[1], args[2], args[3]), null, 2));
      break;
    case 'verify':
      if (args.length < 2) {
        console.log('Usage: verify <id> [verifiedBy]');
        process.exit(1);
      }
      console.log(JSON.stringify(verifyScreenshot(args[1], args[2] || 'cli'), null, 2));
      break;
    case 'pending':
      console.log(JSON.stringify(listPending(), null, 2));
      break;
    case 'verified':
      console.log(JSON.stringify(listVerified(), null, 2));
      break;
    case 'reset':
      console.log(JSON.stringify(reset(), null, 2));
      break;
    default:
      console.log(`
Screenshot Verifier - TDD-Loop Pattern

Commands:
  init              Initialize directory structure
  status            Show current status
  check             Check if completion is allowed
  register <id> <path> <feature>   Register new screenshot
  verify <id> [by]  Mark screenshot as verified
  pending           List pending screenshots
  verified          List verified screenshots
  reset             Reset manifest

Environment:
  SCREENSHOTS_DIR   Screenshots directory (default: ./screenshots)
      `);
  }
}

// Export fuer programmatische Nutzung
module.exports = {
  initializeStructure,
  readManifest,
  writeManifest,
  registerScreenshot,
  verifyScreenshot,
  checkCompletionAllowed,
  getStatus,
  listPending,
  listVerified,
  reset
};
