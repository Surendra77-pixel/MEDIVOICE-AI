const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function getRelativeApiPath(filePath) {
  // src/services/api.js
  const apiPath = path.resolve(__dirname, 'client/src/services/api.js');
  let rel = path.relative(path.dirname(filePath), apiPath).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

walkDir(path.resolve(__dirname, 'client/src/pages'), (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    if (content.includes("import axios from 'axios';")) {
      const apiRelPath = getRelativeApiPath(filePath);
      content = content.replace("import axios from 'axios';", `import api from '${apiRelPath}';`);
    }

    // Remove token fetching
    content = content.replace(/const token = localStorage\.getItem\('token'\);\n?\s*/g, '');

    // Replace axios.get and axios.post patterns
    // e.g. await axios.get('http://localhost:3000/api/v1/doctor/dashboard', { headers: { Authorization: `Bearer ${token}` } })
    // We'll do this carefully with regex.

    // Match axios.get(`...`, { headers: ... })
    content = content.replace(/axios\.get\((['"`])http:\/\/localhost:3000\/api\/v1(.*?)\1,\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{token\}`\s*\}\s*\}\)/g, 'api.get($1$2$1)');
    content = content.replace(/axios\.post\((['"`])http:\/\/localhost:3000\/api\/v1(.*?)\1,\s*(.*?),\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{token\}`\s*\}\s*\}\)/g, 'api.post($1$2$1, $3)');

    // In some places it might not pass headers explicitly (e.g. public routes), just replace baseURL
    content = content.replace(/axios\.get\((['"`])http:\/\/localhost:3000\/api\/v1(.*?)\1\)/g, 'api.get($1$2$1)');
    content = content.replace(/axios\.post\((['"`])http:\/\/localhost:3000\/api\/v1(.*?)\1,\s*(.*?)\)/g, 'api.post($1$2$1, $3)');
    
    // Also catch template literals like axios.post(`http://localhost:3000/api/v1/doctor/consultation/soap`, ...)
    content = content.replace(/axios\.post\(`http:\/\/localhost:3000\/api\/v1(.*?)`,\s*(.*?),\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{token\}`\s*\}\s*\}\)/g, 'api.post(`$1`, $2)');
    content = content.replace(/axios\.get\(`http:\/\/localhost:3000\/api\/v1(.*?)`,\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{token\}`\s*\}\s*\}\)/g, 'api.get(`$1`)');
    content = content.replace(/axios\.get\(`http:\/\/localhost:3000\/api\/v1(.*?)`\)/g, 'api.get(`$1`)');
    content = content.replace(/axios\.post\(`http:\/\/localhost:3000\/api\/v1(.*?)`,\s*(.*?)\)/g, 'api.post(`$1`, $2)');


    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
