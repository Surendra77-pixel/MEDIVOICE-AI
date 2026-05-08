const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function fixEscapesInDir(dir) {
  walkDir(dir, function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let original = content;
      
      // Replace \` with `
      content = content.replace(/\\`/g, '`');
      
      // Replace \$ with $
      content = content.replace(/\\\$/g, '$');
      
      if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed:', filePath);
      }
    }
  });
}

fixEscapesInDir('client/src');
