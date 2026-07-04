const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 bg-black border border-black/10 rounded-2xl flex items-start gap-4 shadow-xl mb-4 cursor-pointer hover:bg-black/90 transition-colors group"
                                onClick={() => {
                                  setTeams((prev) =>
                                    prev.map((team) =>
                                      team.lastMatchStatus === "Empate"
                                        ? {
                                            ...team,
                                            lastMatchStatus: undefined,
                                          }
                                        : team,
                                    ),
                                  );
                                }}
                              >
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                                  <Info
                                    size={18}
                                    className="text-brand-primary"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">
                                    Empate Resolvido Manualmente
                                  </span>
                                  <p className="text-[10px] text-black/80 dark:text-white/80 font-bold uppercase leading-relaxed tracking-wider">
                                    Desmarque o time que deve{" "}
                                    <span className="text-zinc-900 dark:text-white">
                                      descer na fila
                                    </span>
                                    . O time que permanecer selecionado jogará a
                                    próxima partida.
                                  </p>
                                </div>
                              </motion.div>`;

const replacement = `                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl flex items-start gap-3 shadow-sm mb-4 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
                                onClick={() => {
                                  setTeams((prev) =>
                                    prev.map((team) =>
                                      team.lastMatchStatus === "Empate"
                                        ? {
                                            ...team,
                                            lastMatchStatus: undefined,
                                          }
                                        : team,
                                    ),
                                  );
                                }}
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                  <Info
                                    size={16}
                                    className="text-emerald-500"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-0.5">
                                    Empate Resolvido Manualmente
                                  </span>
                                  <p className="text-[10px] text-black/70 dark:text-white/70 font-bold uppercase leading-tight tracking-wider">
                                    Desmarque o time que deve{" "}
                                    <span className="text-zinc-900 dark:text-white">
                                      descer na fila
                                    </span>
                                    . O time que permanecer selecionado jogará a
                                    próxima partida.
                                  </p>
                                </div>
                              </motion.div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
