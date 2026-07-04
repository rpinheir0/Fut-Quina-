const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `          {/* Tabs for Ranking */}
          {currentScreen === "ranking" && (
            <div className="px-6 pb-3">
              <div className="flex gap-1.5 justify-center">
                <button
                  onClick={() => setRankingTab("geral")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "geral" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Geral
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("artilharia")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "artilharia" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Artilharia
                  </span>
                </button>
                <button
                  onClick={() => setRankingTab("assistencias")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${rankingTab === "assistencias" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
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

const replacement1 = `          {/* Tabs for Ranking */}
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

content = content.replace(target1, replacement1);

const target2 = `          {/* Tabs for Finance */}
          {currentScreen === "finance" && !isPrintMode && (
            <div className="px-6 pb-3">
              <div className="flex gap-1.5 justify-center">
                <button
                  onClick={() => setFinanceTab("mensalidades")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "mensalidades" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Mensalidades
                  </span>
                </button>
                <button
                  onClick={() => setFinanceTab("caixa")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "caixa" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Caixa
                  </span>
                </button>
                <button
                  onClick={() => setFinanceTab("despesas")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeTab === "despesas" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
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

const replacement2 = `          {/* Tabs for Finance */}
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

content = content.replace(target2, replacement2);
fs.writeFileSync('src/App.tsx', content);
