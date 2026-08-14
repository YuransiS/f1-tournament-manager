import fs from 'fs';
import https from 'https';
import path from 'path';

const teams = {
  'red-bull': 'https://brandpalettes.com/wp-content/uploads/2018/08/Red-Bull-Logo-PNG.png',
  'mercedes': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg',
  'ferrari': 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Scuderia_Ferrari_Logo.svg',
  'mclaren': 'https://upload.wikimedia.org/wikipedia/commons/6/66/McLaren_Racing_logo.svg',
  'aston-martin': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Aston_Martin_Aramco_Cognizant_F1.svg',
  'alpine': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Alpine_F1_Team_Logo.svg',
  'williams': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Williams_Racing_2020_Logo.svg',
  'alphatauri': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Scuderia_AlphaTauri_Logo.svg',
  'alfa-romeo': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Alfa_Romeo_F1_Team_Stake_logo.svg',
  'haas': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/MoneyGram_Haas_F1_Team_Logo.svg'
};

const dir = './public/teams';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'F1TournamentApp/1.0 (https://github.com/YuransiS/f1-tournament-manager; info@f1app.dev)'
      }
    };
    const req = https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url}: status ${res.statusCode}`));
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
    const ext = url.endsWith('.png') ? 'png' : 'svg';
    const dest = path.join(dir, `${key}.${ext}`);
    try {
      await download(url, dest);
      console.log(`Successfully downloaded ${key}.${ext}`);
    } catch (e) {
      console.error(`Error downloading ${key}: ${e.message}`);
    }
  }
}

run();
