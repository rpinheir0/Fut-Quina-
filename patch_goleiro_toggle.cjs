const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `className={\`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer \${orgProSettings.allowFixedGoalkeeper !== false ? "bg-[#34d399]" : "bg-black/10 dark:bg-white/10"}\`}`;
const r1 = `className={\`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer \${orgProSettings.allowFixedGoalkeeper !== false ? "bg-[#59b823]" : "bg-black/10 dark:bg-white/10"}\`}`;

if (content.includes(t1)) {
    content = content.replace(t1, r1);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Replaced toggle goleiro fixo");
}

