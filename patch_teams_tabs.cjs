const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                <button
                  onClick={() => navigateTeamsTab("chegada")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "chegada" ? "bg-[#34d399] text-[#1E3D2F] shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    PRESENÇA
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("historico")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "historico" ? "bg-[#34d399] text-[#1E3D2F] shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    CONFRONTOS
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("proximos")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "proximos" ? "bg-[#34d399] text-[#1E3D2F] shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    PRÓXIMOS
                  </span>
                </button>`;

const replacement = `                <button
                  onClick={() => navigateTeamsTab("chegada")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "chegada" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    PRESENÇA
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("historico")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "historico" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    CONFRONTOS
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("proximos")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "proximos" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    PRÓXIMOS
                  </span>
                </button>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
