const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove ball icon in Partida em Andamento
const removeTarget = `                <button
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
                
const removeReplacement = `                <button
                  onClick={() => setShowStartMatchConfirm(false)}
                  className="absolute top-4 right-4 p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10 mt-4">
                  Partida em Andamento
                </h3>`;

if (content.includes(removeTarget)) {
    content = content.replace(removeTarget, removeReplacement);
    console.log("Replaced ball icon");
} else {
    console.log("Could not find removeTarget");
}

// 2. Change Continuar Partida button
const btnTarget = `className="w-full h-10 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#34d399]/10 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <PiPlay size={14} />
                  Continuar Partida
                </button>`;
const btnReplacement = `className="w-full h-10 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-zinc-900 dark:text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <PiPlay size={14} />
                  Continuar Partida
                </button>`;

if (content.includes(btnTarget)) {
    content = content.replace(btnTarget, btnReplacement);
    console.log("Replaced Continuar Partida btn");
} else {
    console.log("Could not find btnTarget");
}

// 3. Change icon color in Nova Partida
const iconTarget = `<span className="text-[#34d399] flex items-center justify-center">
                    <PiArrowClockwiseBold size={14} />
                  </span>
                  Nova Partida`;
const iconReplacement = `<span className="text-[#59b823] flex items-center justify-center">
                    <PiArrowClockwiseBold size={14} />
                  </span>
                  Nova Partida`;

if (content.includes(iconTarget)) {
    content = content.replace(iconTarget, iconReplacement);
    console.log("Replaced Nova Partida icon color");
} else {
    console.log("Could not find iconTarget");
}

fs.writeFileSync('src/App.tsx', content);
