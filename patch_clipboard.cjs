const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                            <div
                              className={\`absolute right-5 sm:right-6 bottom-4 sm:bottom-6 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-1.5 sm:gap-2 bg-black/5 dark:bg-white/5 backdrop-blur-xl p-1.5 sm:p-2 pl-3 sm:pl-3 rounded-2xl border border-black/10 dark:border-white/10\`}
                              onClick={async () => {`;

const replacement = `                            <div
                              className={\`absolute right-4 sm:right-5 bottom-3 sm:bottom-4 text-zinc-600 dark:text-zinc-300 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2 bg-black/5 dark:bg-white/5 backdrop-blur-xl p-1.5 sm:p-2 pl-3 sm:pl-3 rounded-xl border border-black/10 dark:border-white/10\`}
                              onClick={async () => {`;

content = content.replace(target, replacement);

const target2 = `                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-200">
                                CAIXA INTELIGENTE
                              </span>`;

const replacement2 = `                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                CAIXA INTELIGENTE
                              </span>`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', content);
