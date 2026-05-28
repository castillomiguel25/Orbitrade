#!/usr/bin/env node

/**
 * i18n Validation Script
 * Validates that all translations have the same keys across all locales
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'es', 'pt', 'it'];
const MESSAGES_DIR = path.join(__dirname, '../app/i18n/messages');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadMessages(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
  
  if (!fs.existsSync(filePath)) {
    log(`❌ File not found: ${filePath}`, 'red');
    return null;
  }

  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the messages object using regex
    const messagesMatch = content.match(/export const \w+Messages = \{([\s\S]*)\};/);
    if (!messagesMatch) {
      log(`❌ Could not parse messages from ${locale}.ts`, 'red');
      return null;
    }

    // Parse the messages (simple string matching for keys)
    const messagesContent = messagesMatch[1];
    const keyPattern = /"([^"]+)":/g;
    const keys = [];
    let match;

    while ((match = keyPattern.exec(messagesContent)) !== null) {
      keys.push(match[1]);
    }

    return keys;
  } catch (error) {
    log(`❌ Error reading ${locale}.ts: ${error.message}`, 'red');
    return null;
  }
}

function validateTranslations() {
  log('\n🔍 Validating i18n translations...', 'cyan');
  log('━'.repeat(60), 'cyan');

  const allMessages = {};
  let hasErrors = false;
  let hasWarnings = false;

  // Load all locales
  log('\n📦 Loading locale files...', 'blue');
  LOCALES.forEach(locale => {
    const keys = loadMessages(locale);
    if (keys) {
      allMessages[locale] = keys;
      log(`  ✓ ${locale}: ${keys.length} keys`, 'green');
    } else {
      hasErrors = true;
    }
  });

  if (Object.keys(allMessages).length === 0) {
    log('\n❌ No messages loaded. Exiting.', 'red');
    process.exit(1);
  }

  // Get reference locale (English)
  const baseLocale = 'en';
  const baseKeys = allMessages[baseLocale];

  if (!baseKeys) {
    log(`\n❌ Base locale (${baseLocale}) not found!`, 'red');
    process.exit(1);
  }

  log(`\n📊 Base locale: ${baseLocale} (${baseKeys.length} keys)`, 'blue');
  log('━'.repeat(60), 'cyan');

  // Check each locale against base
  LOCALES.forEach(locale => {
    if (locale === baseLocale) return;

    const localeKeys = allMessages[locale];
    if (!localeKeys) return;

    log(`\n🔎 Checking ${locale}...`, 'yellow');

    const missingKeys = [];
    const extraKeys = [];

    // Check for missing keys
    baseKeys.forEach(key => {
      if (!localeKeys.includes(key)) {
        missingKeys.push(key);
      }
    });

    // Check for extra keys
    localeKeys.forEach(key => {
      if (!baseKeys.includes(key)) {
        extraKeys.push(key);
      }
    });

    // Report results
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      log(`  ✅ Perfect! All keys match (${localeKeys.length} keys)`, 'green');
    } else {
      if (missingKeys.length > 0) {
        hasErrors = true;
        log(`  ❌ Missing ${missingKeys.length} keys:`, 'red');
        missingKeys.slice(0, 10).forEach(key => {
          log(`     - "${key}"`, 'red');
        });
        if (missingKeys.length > 10) {
          log(`     ... and ${missingKeys.length - 10} more`, 'red');
        }
      }

      if (extraKeys.length > 0) {
        hasWarnings = true;
        log(`  ⚠️  Extra ${extraKeys.length} keys (not in base):`, 'yellow');
        extraKeys.slice(0, 5).forEach(key => {
          log(`     - "${key}"`, 'yellow');
        });
        if (extraKeys.length > 5) {
          log(`     ... and ${extraKeys.length - 5} more`, 'yellow');
        }
      }
    }
  });

  // Summary
  log('\n━'.repeat(60), 'cyan');
  log('\n📈 Summary:', 'cyan');
  log(`  Locales checked: ${LOCALES.length}`, 'blue');
  log(`  Base keys: ${baseKeys.length}`, 'blue');

  if (!hasErrors && !hasWarnings) {
    log('\n✅ All translations are valid!', 'green');
    log('   All locales have matching keys.', 'green');
    process.exit(0);
  } else {
    if (hasErrors) {
      log('\n❌ Validation failed!', 'red');
      log('   Some locales are missing required keys.', 'red');
    }
    if (hasWarnings) {
      log('\n⚠️  Warnings found!', 'yellow');
      log('   Some locales have extra keys not in base locale.', 'yellow');
    }
    process.exit(hasErrors ? 1 : 0);
  }
}

// Run validation
validateTranslations();
