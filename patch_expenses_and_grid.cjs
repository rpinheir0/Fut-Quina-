const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove + button from Despesas
const despesasButtonTarget = `                                  {!isPrintMode && (
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
                                  )}`;

if (content.includes(despesasButtonTarget)) {
    content = content.replace(despesasButtonTarget, '');
    console.log("Removed + button from Despesas.");
} else {
    console.log("Despesas + button target not found.");
}

// 2. Remove Jogadores em Dia / Pendentes grid
const gridTargetRegex = /<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">[\s\S]*?(?=                          \{isPrintMode && \()/;
if (gridTargetRegex.test(content)) {
    content = content.replace(gridTargetRegex, '');
    console.log("Removed Jogadores em Dia / Pendentes grid.");
} else {
    console.log("Grid target not found.");
}

fs.writeFileSync('src/App.tsx', content);
