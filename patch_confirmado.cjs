const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = \`                                <div
                                  className={\\\`text-[8px] font-bold uppercase \${p.isAvailable ? "text-emerald-400" : "text-black/30 dark:text-white/30"}\\\`}
                                >\`;
const replacement1 = \`                                <div
                                  className={\\\`text-[8px] font-bold uppercase \${p.isAvailable ? "text-[#59b823]" : "text-black/30 dark:text-white/30"}\\\`}
                                >\`;

const target2 = \`                              {p.isAvailable && (
                                <CheckCircle2
                                  size={16}
                                  className="text-emerald-400"
                                />
                              )}\`;
const replacement2 = \`                              {p.isAvailable && (
                                <CheckCircle2
                                  size={16}
                                  className="text-[#59b823]"
                                />
                              )}\`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', content);
