const fs = require('fs');

const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');
let count = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.match(/^ +else if \(/) || line.match(/^ +catch \(/) || line.match(/^ +finally \{/)) {
     const match = line.match(/^ +/);
     const spaces = match[0].length;
     const origSpaces = spaces + 6;
     lines[i] = ' '.repeat(origSpaces) + '} ' + line.trim();
     count++;
  } else if (line.match(/^ +else \{/)) {
     const match = line.match(/^ +/);
     const spaces = match[0].length;
     const origSpaces = spaces + 6;
     lines[i] = ' '.repeat(origSpaces) + '} ' + line.trim();
     count++;
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log(`Changed ${count} lines.`);
