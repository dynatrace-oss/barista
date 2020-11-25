const { execSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const internalLinks = process.env.INTERNAL_LINKS.split(',');

if (internalLinks.length === 0) {
  console.log(
    'No internal link configuration was found, please make sure to provide one in the INTERNAL_LINKS environment variable',
  );
  process.exit(1);
}

const results = [];

for (const internalLink of internalLinks) {
  try {
    const execSyncResult = execSync(
      `grep --include="*.json" -i "${internalLink}" -rl ./dist`,
    );
    if (execSyncResult.toString().length > 0) {
      results.push(execSyncResult);
    }
  } catch (err) {
    // Grep errors if nothing is output, we can ignore this one.
  }
}

if (results.length > 0) {
  console.log(`Failed because internal links were found in files:\n${results}`);
  process.exit(1);
}

process.exit(0);
