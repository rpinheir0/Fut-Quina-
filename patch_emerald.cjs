const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replaceAll('dark:bg-[#dce3ee]merald', 'dark:bg-emerald');
content = content.replaceAll('bg-[#dce3ee] dark:bg-emerald', 'bg-emerald'); // if any
fs.writeFileSync('src/App.tsx', content);
