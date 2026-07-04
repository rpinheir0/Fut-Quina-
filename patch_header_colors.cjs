const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetTeamsTabs = `          {/* Tabs for Teams */}
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
                </button>
              </div>
            </div>
          )}`;

const replacementTeamsTabs = `          {/* Tabs for Teams */}
          {currentScreen === "teams" && (
            <div className="px-4 pb-3">
              <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-xl mx-auto w-fit">
                <button
                  onClick={() => navigateTeamsTab("configuracao")}
                  className={\`w-10 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "configuracao" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white"}\`}
                >
                  <PiGearBold size={14} />
                </button>
                <button
                  onClick={() => navigateTeamsTab("chegada")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "chegada" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    PRESENÇA
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("historico")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "historico" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    CONFRONTOS
                  </span>
                </button>
                <button
                  onClick={() => navigateTeamsTab("proximos")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${teamsTab === "proximos" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
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

content = content.replace(targetTeamsTabs, replacementTeamsTabs);

const targetRankingTabs = `          {/* Tabs for Ranking */}
          {currentScreen === "ranking" && (
            <div className="px-4 pb-3">
              <div className="flex bg-black/5 dark:bg-white/5 backdrop-blur-sm p-1 rounded-xl mx-auto w-fit">
                <button
                  onClick={() => setRankingTab("geral")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "geral" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Geral
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("artilharia")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "artilharia" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Artilharia
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("assistencias")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "assistencias" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Assistências
                  </span>
                </button>
              </div>
            </div>
          )}`;

const replacementRankingTabs = `          {/* Tabs for Ranking */}
          {currentScreen === "ranking" && (
            <div className="px-4 pb-3">
              <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-xl mx-auto w-fit">
                <button
                  onClick={() => setRankingTab("geral")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "geral" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Geral
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("artilharia")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "artilharia" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Artilharia
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("assistencias")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "assistencias" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Assistências
                  </span>
                </button>
              </div>
            </div>
          )}`;

content = content.replace(targetRankingTabs, replacementRankingTabs);

const targetFinanceTabs = `          {/* Tabs for Finance */}
          {currentScreen === "finance" && !isPrintMode && (
            <div className="px-4 pb-3">
              <div className="flex bg-black/5 dark:bg-white/5 backdrop-blur-sm p-1 rounded-xl mx-auto w-fit">
                <button
                  onClick={() => setFinanceTab("mensalidades")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "mensalidades" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Mensalidades
                  </span>
                </button>
                <button
                  onClick={() => setFinanceTab("caixa")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "caixa" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Caixa
                  </span>
                </button>
                <button
                  onClick={() => setFinanceTab("despesas")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "despesas" ? "bg-white dark:bg-[#1E3D2F] text-zinc-900 dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Despesas
                  </span>
                </button>
              </div>
            </div>
          )}`;

const replacementFinanceTabs = `          {/* Tabs for Finance */}
          {currentScreen === "finance" && !isPrintMode && (
            <div className="px-4 pb-3">
              <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-xl mx-auto w-fit">
                <button
                  onClick={() => setFinanceTab("mensalidades")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "mensalidades" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Mensalidades
                  </span>
                </button>
                <button
                  onClick={() => setFinanceTab("caixa")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "caixa" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Caixa
                  </span>
                </button>
                <button
                  onClick={() => setFinanceTab("despesas")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "despesas" ? "bg-white text-zinc-900 shadow-sm" : "text-white/50 hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Despesas
                  </span>
                </button>
              </div>
            </div>
          )}`;

content = content.replace(targetFinanceTabs, replacementFinanceTabs);

fs.writeFileSync('src/App.tsx', content);
