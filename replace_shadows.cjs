const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const newContent = content.replace(/shadow-brand-primary\/\d+/g, '');
fs.writeFileSync('src/App.tsx', newContent);
console.log('Done');
