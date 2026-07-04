const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Shirt icon
const shirtTarget = `<span className="text-[#34d399]">
                                  <Shirt size={14} />
                                </span>`;
const shirtReplacement = `<span className="text-[#59b823]">
                                  <Shirt size={14} />
                                </span>`;
content = content.replace(shirtTarget, shirtReplacement);

// Fixar cores toggle
const toggleTarget = `className={\`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer \${fixedColors.enabled ? "bg-[#34d399]" : "bg-black/10 dark:bg-white/10"}\`}`;
const toggleReplacement = `className={\`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer \${fixedColors.enabled ? "bg-[#59b823]" : "bg-black/10 dark:bg-white/10"}\`}`;
content = content.replace(toggleTarget, toggleReplacement);

// Palette A
const paletteATarget = `<Palette
                                    size={14}
                                    className="text-[#34d399]"
                                  />`;
const paletteAReplacement = `<Palette
                                    size={14}
                                    className="text-[#59b823]"
                                  />`;
content = content.replace(paletteATarget, paletteAReplacement);

// Palette B (there might be two of them, let's just replace all occurrences of Palette with text-[#34d399])
content = content.split('<Palette\n                                    size={14}\n                                    className="text-[#34d399]"\n                                  />').join('<Palette\n                                    size={14}\n                                    className="text-[#59b823]"\n                                  />');

// Goleiro fixo icon
const gTarget = `<span className="flex items-center justify-center border border-black/20 dark:border-white/20 rounded-full w-5 h-5 text-[10px] font-black text-[#34d399]">
                                  G
                                </span>`;
const gReplacement = `<span className="flex items-center justify-center border border-[#59b823]/50 rounded-full w-5 h-5 text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e]">
                                  G
                                </span>`;
content = content.replace(gTarget, gReplacement);

// Goleiro fixo toggle
const gToggleTarget = `className={\`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer \${fixedGoalkeeper ? "bg-[#34d399]" : "bg-black/10 dark:bg-white/10"}\`}`;
const gToggleReplacement = `className={\`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer \${fixedGoalkeeper ? "bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e]" : "bg-black/10 dark:bg-white/10"}\`}`;
content = content.replace(gToggleTarget, gToggleReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Done");
