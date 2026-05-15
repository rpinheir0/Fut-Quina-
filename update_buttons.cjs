const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Button 1: Configurar Partida at line 4504
content = content.replace(
  'className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-gradient text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow shadow-black/20 hover:opacity-90 transition-all active:scale-95 glass-3d flex items-center justify-center gap-2"',
  'className="flex-1 sm:flex-none px-4 py-2.5 bg-[#00FF00] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow shadow-black/20 hover:opacity-90 transition-all active:scale-95 glass-3d flex items-center justify-center gap-2"'
);

// Replace Button 2: Plus button at line 4537
content = content.replace(
  'className="p-2 bg-brand-gradient text-[#1E3D2F] rounded-2xl shadow hover:opacity-90 transition-all active:scale-95 flex items-center justify-center aspect-square"',
  'className="p-2 bg-[#00FF00] text-[#1E3D2F] rounded-2xl shadow hover:opacity-90 transition-all active:scale-95 flex items-center justify-center aspect-square"'
);

fs.writeFileSync('src/App.tsx', content);
