const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `                          <span
                            className={\`\${players.find((p) => p.id === showPlayerActionsModal.playerId)?.isGoalkeeper ? "text-sky-400 border-sky-400/40" : "text-black/50 dark:text-white/40 border-black/20 dark:border-white/20"} flex items-center border rounded-full w-4 h-4 justify-center text-[9px] font-black leading-none\`}
                          >
                            G
                          </span>`;
const r1 = `                          <span
                            className={\`\${players.find((p) => p.id === showPlayerActionsModal.playerId)?.isGoalkeeper ? "text-sky-400 border-sky-400/40" : "text-transparent bg-clip-text bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] border-[#59b823]/50"} flex items-center border rounded-full w-4 h-4 justify-center text-[9px] font-black leading-none\`}
                          >
                            G
                          </span>`;

if (content.includes(t1)) {
    content = content.replace(t1, r1);
    console.log("Replaced t1");
} else {
    console.log("t1 not found");
}

const t2 = `                            <span
                              className={\`\${players.find((p) => p.id === showQueuePlayerModal.playerId)?.isGoalkeeper ? "text-sky-400 border-sky-400/40" : "text-black/50 dark:text-white/40 border-black/20 dark:border-white/20"} flex items-center border rounded-full w-4 h-4 justify-center text-[9px] font-black leading-none\`}
                            >
                              G
                            </span>`;
const r2 = `                            <span
                              className={\`\${players.find((p) => p.id === showQueuePlayerModal.playerId)?.isGoalkeeper ? "text-sky-400 border-sky-400/40" : "text-transparent bg-clip-text bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] border-[#59b823]/50"} flex items-center border rounded-full w-4 h-4 justify-center text-[9px] font-black leading-none\`}
                            >
                              G
                            </span>`;

if (content.includes(t2)) {
    content = content.replace(t2, r2);
    console.log("Replaced t2");
} else {
    console.log("t2 not found");
}

fs.writeFileSync('src/App.tsx', content);
