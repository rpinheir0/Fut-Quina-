const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                            <textarea
                              placeholder=" "
                              className={\`w-full h-28 sm:h-32 px-5 sm:px-6 py-5 sm:py-6 rounded-2xl border border-black/10 dark:border-white/10 outline-none transition-all text-sm font-medium resize-none bg-black/70 dark:bg-white/70 dark:bg-black/40 text-zinc-900 dark:text-white placeholder-blue-200/40 focus:ring-2 focus:ring-blue-500/50 peer shadow-inner\`}
                              onChange={(e) => {`;

const replacement = `                            <textarea
                              placeholder=" "
                              className={\`w-full h-20 sm:h-24 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-black/10 dark:border-white/10 outline-none transition-all text-sm font-medium resize-none bg-white dark:bg-black/40 text-zinc-900 dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:ring-2 focus:ring-blue-500/50 peer shadow-inner\`}
                              onChange={(e) => {`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
