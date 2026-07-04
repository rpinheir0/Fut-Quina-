const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-sm flex items-center justify-center text-black/70 dark:text-white/70 transition-colors cursor-pointer shadow-sm"><ArrowLeftRight size={14} /></button>',
  'className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 hover:opacity-80 border border-black/5 dark:border-white/5 backdrop-blur-sm flex items-center justify-center text-zinc-700 dark:text-white/80 transition-colors cursor-pointer shadow-sm"><ArrowLeftRight size={14} /></button>'
);

fs.writeFileSync('src/App.tsx', content);
