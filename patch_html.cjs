const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace('style="background-color: #0b0e17;"', '');
content = content.replace('style="background-color: #0b0e17; color: white;"', '');

fs.writeFileSync('index.html', content);
