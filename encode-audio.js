import fs from 'fs';
import path from 'path';

const dir = 'public/sounds';
const outPath = 'src/lib/audioBase64.ts';

if (!fs.existsSync(dir)) {
  console.log("No sounds directory");
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3'));
let out = '// Auto-generated base64 audio files\n\n';

for (const file of files) {
  const data = fs.readFileSync(path.join(dir, file));
  const b64 = data.toString('base64');
  console.log(`Encoded ${file}: ${(b64.length / 1024).toFixed(2)} KB`);
  
  // Format name: "finalizar-partida.mp3" -> "finalizarPartida"
  const varName = file.replace('.mp3', '').replace(/-([a-z])/g, g => g[1].toUpperCase());
  out += `export const ${varName}Data = 'data:audio/mp3;base64,${b64}';\n`;
}

fs.writeFileSync(outPath, out);
console.log("Written to", outPath);
