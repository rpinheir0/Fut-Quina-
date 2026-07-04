const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                <button
                  onClick={() => setShowStartMatchConfirm(false)}
                  className="absolute top-4 right-4 p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
                <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-lg text-[#34d399] flex items-center justify-center mx-auto mb-2 relative z-10">
                  <IoFootballOutline size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10">
                  Partida em Andamento
                </h3>`;
                
const repl = `                <button
                  onClick={() => setShowStartMatchConfirm(false)}
                  className="absolute top-4 right-4 p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10 mt-4">
                  Partida em Andamento
                </h3>`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    // maybe there's a slight formatting difference?
    const t2 = content.match(/<div className="w-14 h-14 rounded-full bg-black\/5 dark:bg-white\/5 border border-black\/10 dark:border-white\/10 shadow-lg text-\[#34d399\] flex items-center justify-center mx-auto mb-2 relative z-10">\s*<IoFootballOutline size={24} \/>\s*<\/div>\s*<h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10">\s*Partida em Andamento\s*<\/h3>/);
    if (t2) {
        content = content.replace(t2[0], `<h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10 mt-4">
                  Partida em Andamento
                </h3>`);
        console.log("Regex success");
    } else {
        console.log("Not found at all");
    }
}

fs.writeFileSync('src/App.tsx', content);
