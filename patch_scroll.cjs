const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `className="fixed bottom-36 right-5 z-[110] w-14 h-14 bg-[#dce3ee] dark:bg-[#dce3ee]merald-500 text-zinc-900 dark:text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 flex items-center justify-center cursor-pointer transition-colors hover:bg-[#dce3ee] dark:bg-[#dce3ee]merald-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]"`;

const replacement = `className="fixed bottom-36 right-5 z-[110] w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]"`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
