const fs = require('fs');
const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^ +else if \(/) || line.match(/^ +catch \(/) || line.match(/^ +finally \{/) || line.match(/^ +else \{/)) {
     const prev = lines[i-1].trim();
     if (prev !== '}' && !prev.endsWith('}')) {
        const match = line.match(/^ +/);
        const spaces = match[0].length;
        const origSpaces = spaces + 6;
        lines[i] = ' '.repeat(origSpaces) + '} ' + line.trim();
     }
  }
}
fs.writeFileSync(file, lines.join('\n'));
