const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                        className="w-full h-9 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] rounded-xl font-black uppercase text-[10px] tracking-wider flex items-center justify-center px-4 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#34d399]/20 group font-roboto-flex cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#1e3d2f] group-hover:scale-110 transition-transform flex items-center">
                            <IoIosFootball size={14} />
                          </span>
                          <span className="tracking-widest">Registrar Gol</span>
                        </div>`;

const repl = `                        className="w-full h-10 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-zinc-900 dark:text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center px-4 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:opacity-90 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-900 dark:text-white group-hover:scale-110 transition-transform flex items-center">
                            <IoIosFootball size={16} />
                          </span>
                          <span>REGISTRAR GOL</span>
                        </div>`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/App.tsx', content);
