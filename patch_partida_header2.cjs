const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const t2 = content.match(/<div className="w-14 h-14 rounded-full bg-black\/5 dark:bg-white\/5 border border-black\/10 dark:border-white\/10 shadow-lg text-\[#34d399\] flex items-center justify-center mx-auto mb-2 relative z-10">[\s\S]*?<IoFootballOutline size=\{24\} \/>[\s\S]*?<\/div>[\s\S]*?<h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10">[\s\S]*?Partida em Andamento[\s\S]*?<\/h3>/);

if (t2) {
    content = content.replace(t2[0], `<h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10 mt-4">
                  Partida em Andamento
                </h3>`);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Regex success");
} else {
    console.log("Not found at all");
}

