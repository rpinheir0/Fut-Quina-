const fs = require('fs');

const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.match(/^ +$/)) {
    const spaces = line.length;
    if (spaces % 2 !== 0) {
      lines[i] = line + '       }';
    }
  } else if (line.match(/^ +,$/)) {
    const spaces = line.length - 1;
    if (spaces % 2 !== 0) {
      lines[i] = line.replace(',', '       },');
    }
  } else if (line.match(/^ +\);$/)) {
    const spaces = line.length - 2;
    if (spaces % 2 !== 0) {
      lines[i] = line.replace(');', '       });');
    }
  } else if (line.match(/^ +}$/)) {
    const spaces = line.length - 1;
    if (spaces % 2 !== 0) {
      lines[i] = line.replace('}', '       }}');
    }
  }
}

fs.writeFileSync(file, lines.join('\n'));
