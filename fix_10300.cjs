const fs = require('fs');
const file = 'src/App.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const newLines = `                                  className={\`p-4 rounded-2xl border transition-all relative min-h-[110px] flex flex-col justify-center overflow-hidden \${
                                    movingPlayers && isSelectingDestination
                                      ? "cursor-pointer hover:opacity-90"
                                      : "cursor-default"
                                  } \${
                                    isCurrent
                                      ? "shadow-2xl z-10 border-[#53B986] bg-white/5 backdrop-blur-md ring-4 ring-[#53B986]/10"
                                      : "shadow-sm opacity-60 border-white/10 bg-white/5 backdrop-blur-md"
                                  } \${
                                    isFlashing || (movingPlayers && isSelectingDestination && t.playerIds.length < match.config.playersPerTeam)
                                      ? "animate-pulse bg-brand-primary/10 !border-[#53B986]"
                                      : ""
                                  }\`}
                                  style={{`.split('\n');

lines.splice(10300, 15, ...newLines);
fs.writeFileSync(file, lines.join('\n'));
