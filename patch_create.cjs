const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

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
              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-none relative z-10 mt-2">
                {editingMatchId ? "Editar pelada" : "Criar pelada"}
              </h3>`;

content = content.replace(removeTarget, removeReplacement);

const buttonTarget = `              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleScheduleMatch}
                  disabled={!newMatchName.trim()}
                  className="w-full h-10 bg-[#34d399] hover:bg-[#34d399]/90 text-[#1e3d2f] font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#34d399]/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
                >
                  {editingMatchId ? "SALVAR" : "CRIAR"}
                </button>`;

const buttonReplacement = `              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleScheduleMatch}
                  disabled={!newMatchName.trim()}
                  className="w-full h-12 bg-gradient-to-r from-[#59b823] via-[#75c628] to-[#25660e] text-zinc-900 dark:text-white rounded-2xl shadow-lg font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 disabled:opacity-50 hover:opacity-90 cursor-pointer flex items-center justify-center"
                >
                  {editingMatchId ? "SALVAR" : "CRIAR"}
                </button>`;

content = content.replace(buttonTarget, buttonReplacement);
fs.writeFileSync('src/App.tsx', content);
