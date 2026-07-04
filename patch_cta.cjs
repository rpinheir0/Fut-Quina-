const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                      exit={{ opacity: 0, y: -10 }}
                                    {/* CTA Banner */}
                      <motion.div`;

const replacement = `                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex flex-col space-y-4"
                    >
                      {/* CTA Banner */}
                      <motion.div`;

content = content.replace(target, replacement);

const target2 = `                            </div>
                          )}                   </div>
                              </div>
                            </div>
                          )}`;

const replacement2 = `                            </div>
                          )}`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', content);
