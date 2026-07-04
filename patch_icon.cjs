const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                                  ) : (
                                                    <span
                                                      className={\`flex items-center shrink-0 \${isCurrent ? "text-black/70 dark:text-white/60" : "text-black/50 dark:text-white/40"}\`}
                                                    >
                                                      <IoPersonOutline
                                                        size={12}
                                                      />
                                                    </span>
                                                  )}`;

const repl = `                                                  ) : (
                                                    <span
                                                      className={\`flex items-center shrink-0 \${isCurrent ? "text-black/70 dark:text-zinc-800" : "text-black/50 dark:text-white/40"}\`}
                                                    >
                                                      <IoPersonOutline
                                                        size={12}
                                                      />
                                                    </span>
                                                  )}`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/App.tsx', content);
