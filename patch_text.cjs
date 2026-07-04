const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4, delay: 1.2 }}
                                  className="text-xs sm:text-sm text-blue-200/50 leading-tight shrink-0 pt-0.5"
                                >`;

const replacement = `                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4, delay: 1.2 }}
                                  className="text-xs sm:text-sm text-black/50 dark:text-white/40 leading-tight shrink-0 pt-0.5"
                                >`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
