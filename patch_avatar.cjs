const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `<div className="w-full h-full flex items-center justify-center text-zinc-900 dark:text-white text-[9px] bg-gradient-to-br from-indigo-400 to-purple-500 font-bold uppercase">{player.name[0]}</div>`;
const r1 = `<div className="w-full h-full flex items-center justify-center text-zinc-900 dark:text-white text-[9px] bg-gradient-to-br from-[#59b823] to-[#25660e] font-bold uppercase">{player.name[0]}</div>`;

const t2 = `<span className={\`inline-flex mr-1.5 opacity-20 \${totalAvailablePlayers > 0 ? 'text-[#34d399] opacity-100' : ''}\`}><GiSoccerBall size={12} /></span>`;

if (content.includes(t1)) {
    content = content.replace(t1, r1);
} else {
    console.log("t1 not found");
}

if (content.includes(t2)) {
    content = content.replace(t2, "");
} else {
    console.log("t2 not found");
}

fs.writeFileSync('src/App.tsx', content);
