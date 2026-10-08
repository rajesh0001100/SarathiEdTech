import { socialLinks } from '../src/config/socialLinks';

async function runSocialLinksTests() {
  console.log('=== STARTING SOCIAL LINKS & REGISTRATION CONFIGURATION TESTS ===\n');
  let testCount = 0;
  let passedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    testCount++;
    if (condition) {
      passedCount++;
      console.log(`[PASS] Test ${testCount}: ${testName}`);
    } else {
      console.error(`[FAIL] Test ${testCount}: ${testName}${detail ? ` - ${detail}` : ''}`);
    }
  }

  // 1. Google Form Registration URL
  assert(
    socialLinks.registrationForm === 'https://docs.google.com/forms/d/1-ZuFTxovky_ll19hssWRmIo5hyDIh5T33YITeMt7k8g/edit',
    'Registration Form URL matches exact Google Form link',
    socialLinks.registrationForm
  );

  // 2. WhatsApp Group URL
  assert(
    socialLinks.whatsapp === 'https://chat.whatsapp.com/I4DwEWdjaYm6MzAQm5r17H',
    'WhatsApp Group URL matches exact link',
    socialLinks.whatsapp
  );

  // 3. WhatsApp Channel URL
  assert(
    socialLinks.whatsappChannel === 'https://whatsapp.com/channel/0029Vb98k2VICVfkMyEHBv0p',
    'WhatsApp Channel URL matches exact link',
    socialLinks.whatsappChannel
  );

  // 4. LinkedIn URL
  assert(
    socialLinks.linkedin === 'https://www.linkedin.com/in/sarathiedtech',
    'LinkedIn profile URL matches exact link',
    socialLinks.linkedin
  );

  // 5. Instagram URL
  assert(
    socialLinks.instagram === 'https://www.instagram.com/sarathi_edtech/',
    'Instagram profile URL matches exact link',
    socialLinks.instagram
  );

  // 6. Telegram URL
  assert(
    socialLinks.telegram === 'https://t.me/sarathiedtech',
    'Telegram group/channel URL is configured',
    socialLinks.telegram
  );

  console.log(`\n=== CONFIGURATION TEST SUMMARY: ${passedCount}/${testCount} TESTS PASSED ===`);

  if (passedCount !== testCount) {
    process.exit(1);
  }
}

runSocialLinksTests();
