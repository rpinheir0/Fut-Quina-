const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] shadow-lg shadow-[#34d399]/20 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 text-center cursor-pointer"
            >
              Confirmar
            </button>`;

const replacement = `          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-zinc-900 dark:text-white rounded-2xl shadow-lg font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:opacity-90 cursor-pointer"
            >
              Confirmar
            </button>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
