const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
const target = /\s*\)\}\s*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">/;

const chartCode = `                          )}
                          {!isPrintPaymentsOnly && (
                            <div className="w-full mt-4 mb-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 ml-1">
                                Resumo Mensal ({selectedYear})
                              </h3>
                              <div className="h-64 w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={MONTHS.map((month) => {
                                      const rev = (payments || []).reduce(
                                        (acc, p) =>
                                          p.year === selectedYear
                                            ? acc + (p.months[month] || 0)
                                            : acc,
                                        0
                                      );
                                      const exp = (expenses || [])
                                        .filter((e) => {
                                          const d = new Date(e.date);
                                          return (
                                            d.getFullYear() === selectedYear &&
                                            d.getMonth() === MONTHS.indexOf(month)
                                          );
                                        })
                                        .reduce((acc, e) => acc + (e.amount || 0), 0);
                                      return { name: month, Receitas: rev, Despesas: exp };
                                    })}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                  >
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#888888"
                                      opacity={0.2}
                                      vertical={false}
                                    />
                                    <XAxis
                                      dataKey="name"
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{ fontSize: 10, fill: "#888" }}
                                    />
                                    <YAxis
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{ fontSize: 10, fill: "#888" }}
                                      tickFormatter={(val) => \`R$\${val}\`}
                                    />
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: "#18181b",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        color: "#fff",
                                      }}
                                      itemStyle={{ color: "#fff" }}
                                      formatter={(value) => [\`R$ \${value}\`, undefined]}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                                    <Bar
                                      dataKey="Receitas"
                                      fill="#34d399"
                                      radius={[4, 4, 0, 0]}
                                      name="Receitas"
                                    />
                                    <Bar
                                      dataKey="Despesas"
                                      fill="#f87171"
                                      radius={[4, 4, 0, 0]}
                                      name="Despesas"
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">`;

if (target.test(content)) {
  content = content.replace(target, chartCode);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Replaced successfully!");
} else {
  console.log("Target not found!");
}
