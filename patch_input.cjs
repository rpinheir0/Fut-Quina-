const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                    <motion.div
                      key="management-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="space-y-6">
                        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl p-4 sm:p-6 rounded-[32px] border border-black/10 dark:border-white/10 space-y-4 sm:space-y-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <div className="flex-1 flex gap-2 sm:gap-3">
                              <input
                                type="text"
                                placeholder="Nome do jogador..."
                                className={\`flex-1 px-4 sm:px-5 py-3 rounded-2xl border border-black/10 dark:border-white/10 outline-none transition-all bg-black/70 dark:bg-white/70 dark:bg-black/40 text-zinc-900 dark:text-white placeholder-blue-200/40 focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-sm font-medium shadow-inner h-[48px]\`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    addPlayer(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                  }
                                }}
                              />
                              <button
                                onClick={handleImportContacts}
                                className="w-[48px] h-[48px] bg-black/70 dark:bg-white/70 dark:bg-black/40 text-blue-400 rounded-2xl shadow-inner hover:bg-blue-500/10 transition-all active:scale-95 flex items-center justify-center border border-black/10 dark:border-white/10 shrink-0"
                                title="Importar dos Contatos"
                              >
                                <Contact size={20} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => {
                                  const input = document.querySelector(
                                    "input",
                                  ) as HTMLInputElement;
                                  if (input.value.trim()) {
                                    addPlayer(input.value);
                                    input.value = "";
                                  }
                                }}
                                className="w-[48px] h-[48px] bg-black/70 dark:bg-white/70 dark:bg-black/40 text-blue-400 rounded-2xl border border-black/10 dark:border-white/10 shadow-inner hover:bg-blue-500/10 transition-all active:scale-95 flex items-center justify-center shrink-0"
                              >
                                <Plus size={22} strokeWidth={1.5} />
                              </button>
                            </div>`;

const replacement = `                    <motion.div
                      key="management-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl p-3 sm:p-4 rounded-[16px] border border-black/10 dark:border-white/10 space-y-3 sm:space-y-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <div className="flex-1 flex gap-2 sm:gap-3">
                              <input
                                type="text"
                                placeholder="Nome do jogador..."
                                className={\`flex-1 px-4 sm:px-5 py-2 rounded-xl border border-black/10 dark:border-white/10 outline-none transition-all bg-white dark:bg-black/40 text-zinc-900 dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:ring-2 focus:ring-blue-500/50 text-[13px] sm:text-sm font-medium shadow-inner h-[40px]\`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    addPlayer(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                  }
                                }}
                              />
                              <button
                                onClick={handleImportContacts}
                                className="w-[40px] h-[40px] bg-white dark:bg-black/40 text-blue-500 dark:text-blue-400 rounded-xl shadow-inner hover:bg-black/5 dark:hover:bg-blue-500/10 transition-all active:scale-95 flex items-center justify-center border border-black/10 dark:border-white/10 shrink-0"
                                title="Importar dos Contatos"
                              >
                                <Contact size={18} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => {
                                  const input = document.querySelector(
                                    "input",
                                  ) as HTMLInputElement;
                                  if (input.value.trim()) {
                                    addPlayer(input.value);
                                    input.value = "";
                                  }
                                }}
                                className="w-[40px] h-[40px] bg-white dark:bg-black/40 text-blue-500 dark:text-blue-400 rounded-xl border border-black/10 dark:border-white/10 shadow-inner hover:bg-black/5 dark:hover:bg-blue-500/10 transition-all active:scale-95 flex items-center justify-center shrink-0"
                              >
                                <Plus size={20} strokeWidth={1.5} />
                              </button>
                            </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
