const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const navStart = content.indexOf('<nav className="w-full bg-[#111111]');
const navEnd = content.indexOf('</nav>', navStart) + 6;

let navContent = content.substring(navStart, navEnd);

navContent = navContent.replaceAll('text-brand-primary', 'text-[#00ff00]');
navContent = navContent.replaceAll('bg-brand-primary', 'bg-[#00ff00]');

content = content.substring(0, navStart) + navContent + content.substring(navEnd);

fs.writeFileSync('src/App.tsx', content);
