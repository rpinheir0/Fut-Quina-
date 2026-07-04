const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove GiSoccerBall
const removeTarget = `              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingMatchId(null);
                  setNewMatchName("");
                  setNewMatchDay("Segunda");
                  setNewMatchTime("08:00");
                  setNewMatchImage("");
                }}
                className="absolute top-4 right-4 p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
              <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-lg text-[#34d399] flex items-center justify-center mx-auto mb-2 relative z-10">
                <GiSoccerBall size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10">
                {editingMatchId ? "Editar pelada" : "Criar pelada"}
              </h3>`;

const removeReplacement = `              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setEditingMatchId(null);
                  setNewMatchName("");
                  setNewMatchDay("Segunda");
                  setNewMatchTime("08:00");
                  setNewMatchImage("");
                }}
                className="absolute top-4 right-4 p-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full text-black/70 dark:text-white/60 hover:text-zinc-900 dark:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10 mt-4">
                {editingMatchId ? "Editar pelada" : "Criar pelada"}
              </h3>`;

content = content.replace(removeTarget, removeReplacement);

// 2. Change dashed border to solid
const uploadTarget = `                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#34d399]/60 transition-all shadow-sm group relative"
                >`;

const uploadReplacement = `                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-solid border-black/20 dark:border-white/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#34d399]/60 transition-all shadow-sm group relative"
                >`;

content = content.replace(uploadTarget, uploadReplacement);

// 3. Change placeholder text color to gray
const inputTarget = `                <input
                  type="text"
                  value={newMatchName}
                  onChange={(e) => setNewMatchName(e.target.value)}
                  placeholder="Nome da pelada"
                  className="w-full h-10 px-3 rounded-xl outline-none bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-white/30 focus:border-[#34d399] focus:bg-black/10 dark:bg-white/10 transition-all text-center text-xs"
                  autoFocus
                />`;

const inputReplacement = `                <input
                  type="text"
                  value={newMatchName}
                  onChange={(e) => setNewMatchName(e.target.value)}
                  placeholder="Nome da pelada"
                  className="w-full h-10 px-3 rounded-xl outline-none bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:border-[#34d399] focus:bg-black/10 dark:bg-white/10 transition-all text-center text-xs"
                  autoFocus
                />`;

content = content.replace(inputTarget, inputReplacement);

fs.writeFileSync('src/App.tsx', content);
