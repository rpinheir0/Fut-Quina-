const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `            {/* Header Actions */}
            <div className="flex items-center gap-2 relative z-10">
              {!(currentScreen === "players" && !showAddPlayerSection) && (
                <button 
                  onClick={() => setShowGlobalSettings(true)}
                  className="text-zinc-900 dark:text-white hover:opacity-80 transition-opacity p-2 flex items-center justify-center cursor-pointer"
                >
                  <IoIosMenu size={28} />
                </button>
              )}
            </div>`;

const replacement1 = `            {/* Header Actions */}
            <div className="flex items-center gap-2 relative z-10">
              {!(currentScreen === "players" && !showAddPlayerSection) && (
                <button 
                  onClick={() => setShowGlobalSettings(true)}
                  className="text-white hover:opacity-80 transition-opacity p-2 flex items-center justify-center cursor-pointer"
                >
                  <IoIosMenu size={28} />
                </button>
              )}
            </div>`;

content = content.replace(target1, replacement1);

const target2 = `          {/* Tabs for Teams */}
          {currentScreen === "teams" && (
            <div className="px-6 pb-3">
              <div className="flex gap-1.5 justify-center">
                <button
                  onClick={() => navigateTeamsTab("configuracao")}
                  className={\`w-10 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "configuracao" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10"}\`}
                >
                  <PiGearBold size={16} />
                </button>
                <button
                  onClick={() => navigateTeamsTab("chegada")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "chegada" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    PRESENÇA
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("historico")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "historico" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    CONFRONTOS
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("proximos")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "proximos" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    PRÓXIMOS
                  </span>
                </button>
              </div>
            </div>
          )}`;

const replacement2 = `          {/* Tabs for Teams */}
          {currentScreen === "teams" && (
            <div className="px-4 pb-3">
              <div className="flex bg-black/5 dark:bg-white/5 backdrop-blur-sm p-1 rounded-xl mx-auto w-fit">
                <button
                  onClick={() => navigateTeamsTab("configuracao")}
                  className={\`w-10 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "configuracao" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white"}\`}
                >
                  <PiGearBold size={14} />
                </button>
                <button
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
                </button>
              </div>
            </div>
          )}`;

content = content.replace(target2, replacement2);
fs.writeFileSync('src/App.tsx', content);
