const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const arrecadacaoTarget = `                                <p
                                  className={\`text-[9px] font-black uppercase tracking-widest mb-1 relative z-10 \${
                                    isPrintMode ? "text-zinc-600" : "text-[#34d399]/80"
                                  }\`}
                                >
                                  Arrecadação
                                </p>`;

const arrecadacaoReplacement = `                                <div className="flex justify-between items-center mb-1 relative z-10">
                                  <p
                                    className={\`text-[9px] font-black uppercase tracking-widest \${
                                      isPrintMode ? "text-zinc-600" : "text-[#34d399]/80"
                                    }\`}
                                  >
                                    Arrecadação
                                  </p>
                                  {!isPrintMode && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isEditingTotal) {
                                          if (players.length === 0) {
                                            setToast({
                                              message: "Adicione jogadores para ajustar arrecadação",
                                              type: "info",
                                            });
                                            setTimeout(() => setToast(null), 3000);
                                            return;
                                          }
                                          setTotalInput(manualAdjustment.toString());
                                          setIsEditingTotal(true);
                                        }
                                      }}
                                      className="p-1.5 bg-[#34d399] text-[#1E3D2F] rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#34d399]/20"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  )}
                                </div>`;

if (content.includes(arrecadacaoTarget)) {
    content = content.replace(arrecadacaoTarget, arrecadacaoReplacement);
    console.log("Arrecadação updated.");
} else {
    console.log("Arrecadação target not found.");
}

const despesasTarget = `                                <p
                                  className={\`text-[9px] font-black uppercase tracking-widest mb-1 \${
                                    isPrintMode ? "text-zinc-600" : "text-red-400"
                                  }\`}
                                >
                                  Despesas
                                </p>`;

const despesasReplacement = `                                <div className="flex justify-between items-center mb-1 relative z-10">
                                  <p
                                    className={\`text-[9px] font-black uppercase tracking-widest \${
                                      isPrintMode ? "text-zinc-600" : "text-red-400"
                                    }\`}
                                  >
                                    Despesas
                                  </p>
                                  {!isPrintMode && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (players.length === 0) {
                                          setToast({
                                            message: "Adicione jogadores para detalhar despesas",
                                            type: "info"
                                          });
                                          setTimeout(() => setToast(null), 3000);
                                          return;
                                        }
                                        setShowExpenseModal(true);
                                      }}
                                      className="p-1.5 bg-[#34d399] text-[#1E3D2F] rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#34d399]/20"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  )}
                                </div>`;

if (content.includes(despesasTarget)) {
    content = content.replace(despesasTarget, despesasReplacement);
    console.log("Despesas updated.");
} else {
    console.log("Despesas target not found.");
}

fs.writeFileSync('src/App.tsx', content);
