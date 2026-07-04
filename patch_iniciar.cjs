const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<span className="text-zinc-800">
                                <IoFootballOutline size={16} />
                              </span>
                              <span className="text-[8px] font-black uppercase tracking-tight text-zinc-800">
                                Iniciar
                              </span>`;

const repl = `<span className="text-[#59b823]">
                                <IoFootballOutline size={16} />
                              </span>
                              <span className="text-[8px] font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e]">
                                Iniciar
                              </span>`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/App.tsx', content);
