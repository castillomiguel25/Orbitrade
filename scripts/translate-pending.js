#!/usr/bin/env node

/**
 * Auto-translate pending [TRANSLATE] keys
 * Uses EN base values and generates IT/PT translations
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../app/i18n/messages');

// Common word translations (EN -> IT, EN -> PT)
const translations = {
  it: {
    // Common words
    'the': 'il/la',
    'and': 'e',
    'or': 'o',
    'with': 'con',
    'for': 'per',
    'from': 'da',
    'to': 'a',
    'in': 'in',
    'on': 'su',
    'at': 'a',
    'by': 'da',
    'of': 'di',
    'is': 'è',
    'are': 'sono',
    'your': 'tuo/tua',
    'our': 'nostro/nostra',
    'all': 'tutto/tutti',
    'data': 'dati',
    'information': 'informazioni',
    'privacy': 'privacy',
    'security': 'sicurezza',
    'account': 'account',
    'profile': 'profilo',
    'settings': 'impostazioni',
    'contact': 'contatto',
    'support': 'supporto',
    'help': 'aiuto',
    'about': 'informazioni',
    'terms': 'termini',
    'policy': 'politica',
    'operator': 'operatore',
    'fleet': 'flotta',
    'mining': 'minerario',
    'space': 'spazio',
    'cosmic': 'cosmico',
    'quantum': 'quantistico',
    'encryption': 'crittografia',
    'protection': 'protezione',
    'access': 'accesso',
    'system': 'sistema',
    'systems': 'sistemi',
    'protocol': 'protocollo',
    'protocols': 'protocolli',
    'regulations': 'regolamenti',
    'compliance': 'conformità',
    'rights': 'diritti',
    'deposit': 'deposito',
    'withdrawal': 'prelievo',
    'balance': 'saldo',
    'transaction': 'transazione',
    'transactions': 'transazioni',
    'wallet': 'portafoglio',
    'address': 'indirizzo',
    'network': 'rete',
  },
  pt: {
    // Common words
    'the': 'o/a',
    'and': 'e',
    'or': 'ou',
    'with': 'com',
    'for': 'para',
    'from': 'de',
    'to': 'para',
    'in': 'em',
    'on': 'em',
    'at': 'em',
    'by': 'por',
    'of': 'de',
    'is': 'é',
    'are': 'são',
    'your': 'seu/sua',
    'our': 'nosso/nossa',
    'all': 'todo/todos',
    'data': 'dados',
    'information': 'informações',
    'privacy': 'privacidade',
    'security': 'segurança',
    'account': 'conta',
    'profile': 'perfil',
    'settings': 'configurações',
    'contact': 'contato',
    'support': 'suporte',
    'help': 'ajuda',
    'about': 'sobre',
    'terms': 'termos',
    'policy': 'política',
    'operator': 'operador',
    'fleet': 'frota',
    'mining': 'mineração',
    'space': 'espaço',
    'cosmic': 'cósmico',
    'quantum': 'quântico',
    'encryption': 'criptografia',
    'protection': 'proteção',
    'access': 'acesso',
    'system': 'sistema',
    'systems': 'sistemas',
    'protocol': 'protocolo',
    'protocols': 'protocolos',
    'regulations': 'regulamentos',
    'compliance': 'conformidade',
    'rights': 'direitos',
    'deposit': 'depósito',
    'withdrawal': 'retirada',
    'balance': 'saldo',
    'transaction': 'transação',
    'transactions': 'transações',
    'wallet': 'carteira',
    'address': 'endereço',
    'network': 'rede',
  }
};

// Full translations for common phrases (more accurate)
const phraseTranslations = {
  it: {
    // Privacy page
    '[TRANSLATE] ': '',  // Remove the prefix
    'BIOMETRIC DATA': 'DATI BIOMETRICI',
    'FINANCIAL MATRICES': 'MATRICI FINANZIARIE',
    'TECHNICAL TELEMETRY': 'TELEMETRIA TECNICA',
    'DATA COLLECTION CATEGORIES': 'CATEGORIE DI RACCOLTA DATI',
    'FLEET REGULATIONS': 'REGOLAMENTI DELLA FLOTTA',
    'ACCESS PROTOCOLS': 'PROTOCOLLI DI ACCESSO',
    'DELETION PROCEDURES': 'PROCEDURE DI ELIMINAZIONE',
    'MODIFICATION RIGHTS': 'DIRITTI DI MODIFICA',
    'PORTABILITY SYSTEMS': 'SISTEMI DI PORTABILITÀ',
    'GDPR COMPLIANCE': 'CONFORMITÀ GDPR',
    'PRIVACY INQUIRIES': 'RICHIESTE DI PRIVACY',
    'CONTACT PRIVACY': 'CONTATTA PRIVACY',
    'BEHAVIORAL TRACKING SYSTEMS': 'SISTEMI DI TRACCIAMENTO COMPORTAMENTALE',
    'COMMUNICATION CHANNELS': 'CANALI DI COMUNICAZIONE',
    'DATA ACQUISITION PROTOCOLS': 'PROTOCOLLI DI ACQUISIZIONE DATI',
    'DATA RETENTION CYCLES': 'CICLI DI CONSERVAZIONE DATI',
    'DATA TRANSMISSION RESTRICTIONS': 'RESTRIZIONI DI TRASMISSIONE DATI',
    'INFORMATION PROCESSING MATRIX': 'MATRICE DI ELABORAZIONE INFORMAZIONI',
    'OPERATOR ACCESS RIGHTS': 'DIRITTI DI ACCESSO OPERATORE',
    'QUANTUM ENCRYPTION SHIELDS': 'SCUDI DI CRITTOGRAFIA QUANTISTICA',
    'Operator neural signature': 'Firma neurale dell\'operatore',
    'Quantum communication frequency': 'Frequenza di comunicazione quantistica',
    'Biometric authentication codes': 'Codici di autenticazione biometrica',
    'Temporal birth coordinates': 'Coordinate temporali di nascita',
    'TRC20 cosmic wallet addresses': 'Indirizzi portafoglio cosmico TRC20',
    'Resource extraction history': 'Storico estrazione risorse',
    'Mining operation investments': 'Investimenti operazioni minerarie',
    'Fleet referral network data': 'Dati rete referral flotta',
    'Ship IP coordinates': 'Coordinate IP nave',
    'Navigation tracking cookies': 'Cookie di tracciamento navigazione',
    'Operational usage patterns': 'Pattern di utilizzo operativo',
    'Mission activity logs': 'Log attività missione',
    'Review all stored operator data': 'Rivedi tutti i dati operatore memorizzati',
    'Permanent data removal protocols': 'Protocolli di rimozione dati permanente',
    'Update incorrect information': 'Aggiorna informazioni errate',
    'Data transfer to other systems': 'Trasferimento dati ad altri sistemi',
    // Security
    'SECURITY': 'SICUREZZA',
    'Security Protocol': 'Protocollo di Sicurezza',
    'Shield Status': 'Stato Scudo',
    'Active': 'Attivo',
    'Inactive': 'Inattivo',
    // Profile
    'Profile': 'Profilo',
    'Edit Profile': 'Modifica Profilo',
    'Save Changes': 'Salva Modifiche',
    'Cancel': 'Annulla',
    // Dashboard
    'Dashboard': 'Pannello',
    'Balance': 'Saldo',
    'Available': 'Disponibile',
    'Deposit': 'Deposita',
    'Withdraw': 'Ritira',
    // Withdrawal
    'Withdrawal': 'Prelievo',
    'Withdraw Amount': 'Importo Prelievo',
    'Processing': 'In Elaborazione',
    'Completed': 'Completato',
    'Pending': 'In Attesa',
    // Contact
    'Contact Us': 'Contattaci',
    'Send Message': 'Invia Messaggio',
    'Email': 'Email',
    'Subject': 'Oggetto',
    'Message': 'Messaggio',
    // FAQ
    'FAQ': 'Domande Frequenti',
    'Frequently Asked Questions': 'Domande Frequenti',
    'Search': 'Cerca',
    // Terms
    'Terms of Service': 'Termini di Servizio',
    'Privacy Policy': 'Informativa Privacy',
    // About
    'About Us': 'Chi Siamo',
    'Our Mission': 'La Nostra Missione',
    'Our Team': 'Il Nostro Team',
  },
  pt: {
    '[TRANSLATE] ': '',
    'BIOMETRIC DATA': 'DADOS BIOMÉTRICOS',
    'FINANCIAL MATRICES': 'MATRIZES FINANCEIRAS',
    'TECHNICAL TELEMETRY': 'TELEMETRIA TÉCNICA',
    'DATA COLLECTION CATEGORIES': 'CATEGORIAS DE COLETA DE DADOS',
    'FLEET REGULATIONS': 'REGULAMENTOS DA FROTA',
    'ACCESS PROTOCOLS': 'PROTOCOLOS DE ACESSO',
    'DELETION PROCEDURES': 'PROCEDIMENTOS DE EXCLUSÃO',
    'MODIFICATION RIGHTS': 'DIREITOS DE MODIFICAÇÃO',
    'PORTABILITY SYSTEMS': 'SISTEMAS DE PORTABILIDADE',
    'GDPR COMPLIANCE': 'CONFORMIDADE GDPR',
    'PRIVACY INQUIRIES': 'CONSULTAS DE PRIVACIDADE',
    'CONTACT PRIVACY': 'CONTATAR PRIVACIDADE',
    'BEHAVIORAL TRACKING SYSTEMS': 'SISTEMAS DE RASTREAMENTO COMPORTAMENTAL',
    'COMMUNICATION CHANNELS': 'CANAIS DE COMUNICAÇÃO',
    'DATA ACQUISITION PROTOCOLS': 'PROTOCOLOS DE AQUISIÇÃO DE DADOS',
    'DATA RETENTION CYCLES': 'CICLOS DE RETENÇÃO DE DADOS',
    'DATA TRANSMISSION RESTRICTIONS': 'RESTRIÇÕES DE TRANSMISSÃO DE DADOS',
    'INFORMATION PROCESSING MATRIX': 'MATRIZ DE PROCESSAMENTO DE INFORMAÇÕES',
    'OPERATOR ACCESS RIGHTS': 'DIREITOS DE ACESSO DO OPERADOR',
    'QUANTUM ENCRYPTION SHIELDS': 'ESCUDOS DE CRIPTOGRAFIA QUÂNTICA',
    'Operator neural signature': 'Assinatura neural do operador',
    'Quantum communication frequency': 'Frequência de comunicação quântica',
    'Biometric authentication codes': 'Códigos de autenticação biométrica',
    'Temporal birth coordinates': 'Coordenadas temporais de nascimento',
    'TRC20 cosmic wallet addresses': 'Endereços de carteira cósmica TRC20',
    'Resource extraction history': 'Histórico de extração de recursos',
    'Mining operation investments': 'Investimentos em operações de mineração',
    'Fleet referral network data': 'Dados da rede de referência da frota',
    'Ship IP coordinates': 'Coordenadas IP da nave',
    'Navigation tracking cookies': 'Cookies de rastreamento de navegação',
    'Operational usage patterns': 'Padrões de uso operacional',
    'Mission activity logs': 'Logs de atividade de missão',
    'Review all stored operator data': 'Revisar todos os dados do operador armazenados',
    'Permanent data removal protocols': 'Protocolos de remoção permanente de dados',
    'Update incorrect information': 'Atualizar informações incorretas',
    'Data transfer to other systems': 'Transferência de dados para outros sistemas',
    // Security
    'SECURITY': 'SEGURANÇA',
    'Security Protocol': 'Protocolo de Segurança',
    'Shield Status': 'Status do Escudo',
    'Active': 'Ativo',
    'Inactive': 'Inativo',
    // Profile
    'Profile': 'Perfil',
    'Edit Profile': 'Editar Perfil',
    'Save Changes': 'Salvar Alterações',
    'Cancel': 'Cancelar',
    // Dashboard
    'Dashboard': 'Painel',
    'Balance': 'Saldo',
    'Available': 'Disponível',
    'Deposit': 'Depositar',
    'Withdraw': 'Retirar',
    // Withdrawal
    'Withdrawal': 'Retirada',
    'Withdraw Amount': 'Valor da Retirada',
    'Processing': 'Processando',
    'Completed': 'Concluído',
    'Pending': 'Pendente',
    // Contact
    'Contact Us': 'Contate-nos',
    'Send Message': 'Enviar Mensagem',
    'Email': 'Email',
    'Subject': 'Assunto',
    'Message': 'Mensagem',
    // FAQ
    'FAQ': 'Perguntas Frequentes',
    'Frequently Asked Questions': 'Perguntas Frequentes',
    'Search': 'Buscar',
    // Terms
    'Terms of Service': 'Termos de Serviço',
    'Privacy Policy': 'Política de Privacidade',
    // About
    'About Us': 'Sobre Nós',
    'Our Mission': 'Nossa Missão',
    'Our Team': 'Nossa Equipe',
  }
};

function translateText(text, locale) {
  let result = text;
  
  // First remove [TRANSLATE] prefix
  result = result.replace('[TRANSLATE] ', '');
  
  // Apply phrase translations first (longer matches)
  const phrases = phraseTranslations[locale] || {};
  Object.keys(phrases).sort((a, b) => b.length - a.length).forEach(phrase => {
    if (phrase && phrases[phrase]) {
      result = result.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), phrases[phrase]);
    }
  });
  
  return result;
}

function processFile(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Count before
  const beforeCount = (content.match(/\[TRANSLATE\]/g) || []).length;
  
  // Find and replace all [TRANSLATE] entries
  const regex = /("[\w.]+"):\s*"\[TRANSLATE\]\s*([^"]+)"/g;
  
  content = content.replace(regex, (match, key, value) => {
    const translated = translateText(value, locale);
    return `${key}: "${translated}"`;
  });
  
  // Count after
  const afterCount = (content.match(/\[TRANSLATE\]/g) || []).length;
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`${locale}: ${beforeCount} -> ${afterCount} [TRANSLATE] keys (translated ${beforeCount - afterCount})`);
  
  return { before: beforeCount, after: afterCount };
}

// Process IT and PT
console.log('\n🔄 Auto-translating pending keys...\n');
processFile('it');
processFile('pt');
console.log('\n✅ Done! Review the translations manually for accuracy.\n');
