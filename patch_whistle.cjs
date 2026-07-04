const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                        <div className="flex items-center gap-2.5 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center backdrop-blur-md border border-black/10 dark:border-white/10 text-[#34d399]"><GiWhistle size={16} /></div>
                                            <div>`;

const replacement = `                                        <div className="flex items-center gap-2.5 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center backdrop-blur-md border border-black/5 dark:border-white/5 text-zinc-700 dark:text-white/80 shadow-sm"><GiWhistle size={16} /></div>
                                            <div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
