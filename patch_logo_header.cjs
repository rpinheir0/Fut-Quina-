const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                    <FutQuinaLogo
                      size="md"
                      style={{ color: "#83A8FF" }}
                      titleColorClass="text-[#83A8FF]"
                      subColorClass="text-zinc-900 dark:text-white"
                      align="start"
                    />`;

const replacement = `                    <FutQuinaLogo
                      size="md"
                      style={{ color: "#83A8FF" }}
                      titleColorClass="text-[#83A8FF]"
                      subColorClass="text-white"
                      align="start"
                    />`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
