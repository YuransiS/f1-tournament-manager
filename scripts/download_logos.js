import fs from 'fs';
import https from 'https';
import path from 'path';

const teams = {
  'red-bull': 'https://brandpalettes.com/wp-content/uploads/2018/08/Red-Bull-Logo-PNG.png',
  'mercedes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg/1024px-Mercedes_AMG_Petronas_F1_Logo.svg.png',
  'ferrari': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Scuderia_Ferrari_Logo.svg/1024px-Scuderia_Ferrari_Logo.svg.png',
  'mclaren': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/McLaren_Racing_logo.svg/1024px-McLaren_Racing_logo.svg.png',
  'aston-martin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Aston_Martin_Aramco_Cognizant_F1.svg/1024px-Aston_Martin_Aramco_Cognizant_F1.svg.png',
  'alpine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Alpine_F1_Team_Logo.svg/1024px-Alpine_F1_Team_Logo.svg.png',
  'williams': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Williams_Racing_2020_Logo.svg/1024px-Williams_Racing_2020_Logo.svg.png',
  'alphatauri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Scuderia_AlphaTauri_Logo.svg/1024px-Scuderia_AlphaTauri_Logo.svg.png',
  'alfa-romeo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Alfa_Romeo_F1_Team_Stake_logo.svg/1024px-Alfa_Romeo_F1_Team_Stake_logo.svg.png',
  'haas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MoneyGram_Haas_F1_Team_Logo.svg/1024px-MoneyGram_Haas_F1_Team_Logo.svg.png'
};

const dir = './public/teams';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    req.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const [key, url] of Object.entries(teams)) {
    const dest = path.join(dir, `${key}.png`);
    try {
      await download(url, dest);
      console.log(`Successfully downloaded ${key}.png`);
    } catch (e) {
      console.error(`Error downloading ${key}: ${e.message}`);
    }
  }
}

run();
