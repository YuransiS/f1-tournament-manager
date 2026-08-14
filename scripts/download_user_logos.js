import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

const teamUrls = {
  'mclaren': 'https://pitlanemotor.com/wp-content/uploads/2023/09/mclaren.png',
  'alphatauri': 'https://images.seeklogo.com/logo-png/38/2/alphatauri-logo-png_seeklogo-385647.png',
  'williams': 'https://www.cllfrance.com/user/themes/arenaria/images/clients/swde.png',
  'aston-martin': 'https://pngimg.com/uploads/aston_martin/aston_martin_PNG48.png',
  'alfa-romeo': 'https://pngimg.com/uploads/alfa_romeo/alfa_romeo_PNG24.png',
  'ferrari': 'https://purepng.com/public/uploads/large/purepng.com-ferrari-logoferrariferrari-carsferrari-automobilescarssportferrari-logo-17015274809730h2ic.png',
  'haas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/TGR_Haas_F1_Team_Logo_%282026%29.svg/1280px-TGR_Haas_F1_Team_Logo_%282026%29.svg.png'
};

const dir = './public/teams';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };
    const req = client.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsed = new URL(url);
          redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
        }
        return download(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: HTTP ${res.statusCode}`));
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
  for (const [key, url] of Object.entries(teamUrls)) {
    const dest = path.join(dir, `${key}.png`);
    try {
      await download(url, dest);
      const stats = fs.statSync(dest);
      console.log(`Successfully downloaded ${key}.png (${stats.size} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${key}: ${e.message}`);
    }
  }
}

run();
