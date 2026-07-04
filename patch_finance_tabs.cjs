const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          {/* Tabs for Finance */}
          {currentScreen === "finance" && !isPrintMode && (
            <div className="px-6 pb-3">
              <div className="flex gap-1.5 justify-center">
                <button
                  onClick={() => setFinanceSubScreen("balanco")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeSubScreen === "balanco" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors\`}
                  >
                    Balanço
                  </span>
                </button>
                <button
                  onClick={() => setFinanceSubScreen("mensalidade")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeSubScreen === "mensalidade" ? "bg-[#34d399] text-[#1E3D2F]" : "bg-black/5 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-black/10 dark:bg-white/10 font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors\`}
                  >
                    Mensalidade
                  </span>
                </button>
              </div>
            </div>
          )}`;

const replacement = `          {/* Tabs for Finance */}
          {currentScreen === "finance" && !isPrintMode && (
            <div className="px-4 pb-3">
              <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-xl mx-auto w-fit">
                <button
                  onClick={() => setFinanceSubScreen("balanco")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeSubScreen === "balanco" ? "bg-[#34d399] text-[#1E3D2F] shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Balanço
                  </span>
                </button>
                <button
                  onClick={() => setFinanceSubScreen("mensalidade")}
                  className={\`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all \${financeSubScreen === "mensalidade" ? "bg-[#34d399] text-[#1E3D2F] shadow-sm" : "text-black/50 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white font-medium"}\`}
                >
                  <span
                    className={\`text-[9px] font-black uppercase tracking-wider text-center w-full transition-colors font-roboto-flex\`}
                  >
                    Mensalidade
                  </span>
                </button>
              </div>
            </div>
          )}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
