#!/usr/bin/env node

/**
 * i18n Synchronization Script
 * Ensures all locale files have the same keys as the base locale (EN)
 * - Adds missing keys with [NEEDS TRANSLATION] prefix
 * - Removes extra keys not in base
 * - Detects and reports duplicates
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'es'];
const BASE_LOCALE = 'en';
const MESSAGES_DIR = path.join(__dirname, '../app/i18n/messages');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Parse a TypeScript messages file and extract key-value pairs
function parseMessagesFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const messages = {};
  const duplicates = [];
  
  // Match all key-value pairs: "key": "value" or "key": 'value'
  const regex = /"([^"]+)":\s*["'`]([^"'`]*)["'`]/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const value = match[2];
    
    if (messages[key] !== undefined) {
      duplicates.push(key);
    }
    messages[key] = value;
  }
  
  return { messages, duplicates };
}

// Generate TypeScript file content from messages object
function generateFileContent(localeName, messages) {
  const sortedKeys = Object.keys(messages).sort();
  
  let content = `export const ${localeName}Messages = {\n`;
  
  sortedKeys.forEach((key, index) => {
    const value = messages[key].replace(/"/g, '\\"');
    const comma = index < sortedKeys.length - 1 ? ',' : '';
    content += `  "${key}": "${value}"${comma}\n`;
  });
  
  content += '};\n';
  
  return content;
}

// Main sync function
function syncTranslations(dryRun = false) {
  log('\n🔄 Synchronizing i18n translations...', 'cyan');
  log('━'.repeat(60), 'cyan');
  
  // Load base locale (EN)
  const baseFilePath = path.join(MESSAGES_DIR, `${BASE_LOCALE}.ts`);
  const { messages: baseMessages, duplicates: baseDuplicates } = parseMessagesFile(baseFilePath);
  const baseKeys = Object.keys(baseMessages);
  
  log(`\n📦 Base locale: ${BASE_LOCALE} (${baseKeys.length} keys)`, 'blue');
  
  if (baseDuplicates.length > 0) {
    log(`\n⚠️  Duplicates found in ${BASE_LOCALE}:`, 'yellow');
    baseDuplicates.forEach(key => log(`   - "${key}"`, 'yellow'));
  }
  
  const stats = {
    totalAdded: 0,
    totalRemoved: 0,
    totalDuplicates: 0,
  };
  
  // Process each non-base locale
  LOCALES.filter(l => l !== BASE_LOCALE).forEach(locale => {
    log(`\n🔎 Processing ${locale}...`, 'magenta');
    
    const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
    const { messages: localeMessages, duplicates } = parseMessagesFile(filePath);
    const localeKeys = Object.keys(localeMessages);
    
    // Find missing and extra keys
    const missingKeys = baseKeys.filter(k => !localeKeys.includes(k));
    const extraKeys = localeKeys.filter(k => !baseKeys.includes(k));
    
    log(`   Current: ${localeKeys.length} keys`, 'blue');
    
    if (duplicates.length > 0) {
      log(`   ⚠️  ${duplicates.length} duplicate keys found:`, 'yellow');
      duplicates.slice(0, 5).forEach(k => log(`      - "${k}"`, 'yellow'));
      if (duplicates.length > 5) {
        log(`      ... and ${duplicates.length - 5} more`, 'yellow');
      }
      stats.totalDuplicates += duplicates.length;
    }
    
    // Add missing keys with placeholder
    if (missingKeys.length > 0) {
      log(`   ➕ Adding ${missingKeys.length} missing keys`, 'green');
      missingKeys.forEach(key => {
        // Use English value with [TRANSLATE] prefix for context
        localeMessages[key] = `[TRANSLATE] ${baseMessages[key]}`;
      });
      stats.totalAdded += missingKeys.length;
    }
    
    // Remove extra keys
    if (extraKeys.length > 0) {
      log(`   ➖ Removing ${extraKeys.length} extra keys`, 'red');
      extraKeys.forEach(key => {
        delete localeMessages[key];
      });
      stats.totalRemoved += extraKeys.length;
    }
    
    // Verify final count
    const finalCount = Object.keys(localeMessages).length;
    if (finalCount !== baseKeys.length) {
      log(`   ❌ ERROR: Final count (${finalCount}) doesn't match base (${baseKeys.length})`, 'red');
    } else {
      log(`   ✅ Synchronized: ${finalCount} keys`, 'green');
    }
    
    // Write file if not dry run
    if (!dryRun) {
      const newContent = generateFileContent(locale, localeMessages);
      fs.writeFileSync(filePath, newContent, 'utf8');
      log(`   💾 File saved: ${locale}.ts`, 'green');
    }
  });
  
  // Summary
  log('\n' + '━'.repeat(60), 'cyan');
  log('\n📊 Synchronization Summary:', 'cyan');
  log(`   Base keys: ${baseKeys.length}`, 'blue');
  log(`   Keys added: ${stats.totalAdded}`, 'green');
  log(`   Keys removed: ${stats.totalRemoved}`, 'red');
  log(`   Duplicates found: ${stats.totalDuplicates}`, 'yellow');
  
  if (dryRun) {
    log('\n⚠️  DRY RUN - No files were modified', 'yellow');
    log('   Run without --dry-run to apply changes', 'yellow');
  } else {
    log('\n✅ Synchronization complete!', 'green');
    log(`   All locales now have ${baseKeys.length} keys`, 'green');
  }
  
  // Report keys needing translation
  log('\n📝 Keys needing translation:', 'cyan');
  LOCALES.filter(l => l !== BASE_LOCALE).forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
    const content = fs.readFileSync(filePath, 'utf8');
    const needsTranslation = (content.match(/\[TRANSLATE\]/g) || []).length;
    if (needsTranslation > 0) {
      log(`   ${locale}: ${needsTranslation} keys need translation`, 'yellow');
    } else {
      log(`   ${locale}: ✅ All translated`, 'green');
    }
  });
  
  return stats;
}

// Check for duplicates only
function checkDuplicates() {
  log('\n🔍 Checking for duplicate keys...', 'cyan');
  log('━'.repeat(60), 'cyan');
  
  let totalDuplicates = 0;
  
  LOCALES.forEach(locale => {
    const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
    const { duplicates } = parseMessagesFile(filePath);
    
    if (duplicates.length > 0) {
      log(`\n❌ ${locale}: ${duplicates.length} duplicates`, 'red');
      duplicates.forEach(k => log(`   - "${k}"`, 'red'));
      totalDuplicates += duplicates.length;
    } else {
      log(`\n✅ ${locale}: No duplicates`, 'green');
    }
  });
  
  if (totalDuplicates === 0) {
    log('\n✅ No duplicate keys found in any locale!', 'green');
  } else {
    log(`\n❌ Total duplicates found: ${totalDuplicates}`, 'red');
  }
  
  return totalDuplicates;
}

// CLI
const args = process.argv.slice(2);
const command = args[0] || 'sync';

switch (command) {
  case 'sync':
    syncTranslations(args.includes('--dry-run'));
    break;
  case 'check':
    checkDuplicates();
    break;
  case 'help':
    log('\n📖 i18n Sync Script Usage:', 'cyan');
    log('   node sync-i18n.js sync [--dry-run]  - Sync all locales with base (EN)');
    log('   node sync-i18n.js check             - Check for duplicate keys only');
    log('   node sync-i18n.js help              - Show this help');
    break;
  default:
    log(`Unknown command: ${command}. Use 'help' for usage.`, 'red');
}
