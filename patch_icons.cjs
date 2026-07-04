const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-red-500/20 border border-black/10 dark:border-white/10 backdrop-blur-sm flex items-center justify-center text-black/70 dark:text-white/70 transition-colors cursor-pointer shadow-sm"><Trash2 size={14} /></button>',
  'className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 hover:from-red-200 hover:to-red-300 dark:hover:from-red-900/40 dark:hover:to-red-900/40 border border-black/5 dark:border-white/5 backdrop-blur-sm flex items-center justify-center text-zinc-700 dark:text-white/80 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer shadow-sm"><Trash2 size={14} /></button>'
);

content = content.replace(
  'className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:border-white/10 border border-black/10 dark:border-white/10 backdrop-blur-sm flex items-center justify-center text-black/70 dark:text-white/70 transition-colors cursor-pointer shadow-sm"><ArrowLeftRight size={14} /></button>',
  'className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 hover:opacity-80 border border-black/5 dark:border-white/5 backdrop-blur-sm flex items-center justify-center text-zinc-700 dark:text-white/80 transition-colors cursor-pointer shadow-sm"><ArrowLeftRight size={14} /></button>'
);

content = content.replace(
  'className={`${shrinkEditButton ? "w-8 shrink-0" : "flex-1"} bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-sm rounded-full h-8 flex items-center justify-center text-zinc-900 dark:text-white text-[11px] font-bold gap-1 transition-all duration-300 shadow-sm overflow-hidden`}',
  'className={`${shrinkEditButton ? "w-8 shrink-0" : "flex-1"} bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 hover:opacity-80 border border-black/5 dark:border-white/5 backdrop-blur-sm rounded-full h-8 flex items-center justify-center text-zinc-700 dark:text-white/80 text-[11px] font-bold gap-1 transition-all duration-300 shadow-sm overflow-hidden`}'
);

fs.writeFileSync('src/App.tsx', content);
