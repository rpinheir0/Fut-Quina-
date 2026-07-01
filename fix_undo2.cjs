const fs = require('fs');
const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');
let count = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^ +\} else if \(/) || line.match(/^ +\} catch \(/) || line.match(/^ +\} finally \{/) || line.match(/^ +\} else \{/)) {
     const prev = lines[i-1].trim();
     // If the previous line doesn't end with } or it's not a block ending
     if (!prev.endsWith('}')) {
        const match = line.match(/^ +/);
        const spaces = match[0].length;
        const origSpaces = Math.max(0, spaces - 6);
        lines[i] = ' '.repeat(origSpaces) + line.trim().substring(2);
        count++;
     }
  }
}
fs.writeFileSync(file, lines.join('\n'));
console.log(`Reverted ${count} bad bracket additions.`);
