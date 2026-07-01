const fs = require('fs');
const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');
let count = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match catch, finally, else with ANY leading spaces (even 0)
  if (line.match(/^ *catch \(/) || line.match(/^ *finally \{/) || line.match(/^ *else \{/) || line.match(/^ *else if \(/)) {
     // If it doesn't already have '}'
     if (!line.includes('}')) {
         lines[i] = '} ' + line.trim();
         count++;
     }
  }
}
fs.writeFileSync(file, lines.join('\n'));
console.log(`Added } to ${count} lines.`);
