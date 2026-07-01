const fs = require('fs');

const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.match(/^ +       }$/)) {
    lines[i] = line.replace('       }', '');
  } else if (line.match(/^ +       },$/)) {
    lines[i] = line.replace('       },', ',');
  } else if (line.match(/^ +       }\);$/)) {
    lines[i] = line.replace('       });', ');');
  } else if (line.match(/^ +       }}$/)) {
    lines[i] = line.replace('       }}', '}');
  }
}

fs.writeFileSync(file, lines.join('\n'));
