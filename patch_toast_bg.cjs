const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '"bg-[#dce3ee] dark:bg-emerald-500/20 text-[#59b823] border border-emerald-500/20"',
  '"bg-emerald-100 dark:bg-emerald-500/20 text-[#59b823] border border-emerald-500/20"'
);

content = content.replace(
  '"bg-[#dce3ee] dark:bg-emerald-500/20 text-[#59b823] border border-emerald-500/20"',
  '"bg-emerald-100 dark:bg-emerald-500/20 text-[#59b823] border border-emerald-500/20"'
);

fs.writeFileSync('src/App.tsx', content);
