const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

function replaceColors(startTag, endTag) {
  let startIdx = content.indexOf(startTag);
  let endIdx = content.indexOf(endTag, startIdx);
  
  if (startIdx !== -1 && endIdx !== -1) {
    let section = content.substring(startIdx, endIdx);
    
    // Replace text-white to text-black
    section = section.replace(/text-white(\/[0-9]+)?/g, function(match, p1) {
      if (p1) {
        return 'text-black' + p1;
      }
      return 'text-black';
    });
    
    // Replace bg-[#1E3D2F]/90 to transparent or light
    section = section.replace(/bg-\[#1E3D2F\]\/90/g, 'bg-zinc-200/50');
    section = section.replace(/bg-white\/5/g, 'bg-black/5');
    section = section.replace(/bg-white\/10/g, 'bg-black/10');
    section = section.replace(/divide-white\/5/g, 'divide-black/5');
    section = section.replace(/border-white\/10/g, 'border-black/10');
    section = section.replace(/border-white\/5/g, 'border-black/5');
    
    content = content.substring(0, startIdx) + section + content.substring(endIdx);
    console.log('Replaced between ' + startTag + ' and ' + endTag);
  } else {
    console.log('Not found: ' + startTag);
  }
}

// 1. For Gerenciar (players)
replaceColors('<section className="rounded-2xl overflow-hidden bg-[#1E3D2F]/90', '</section>');

// 2. For Ranking
replaceColors('<motion.div \n                className={`bg-[#1E3D2F]/90', '{/* Finance Modal */}');

// 3. For the wrapper of players map if needed. Wait, in players there's:
// <div className="max-w-3xl mx-auto space-y-6">
// Let's replace the players wrapper:
content = content.replace(
  '<div className="max-w-3xl mx-auto space-y-6">',
  '<div className="max-w-3xl mx-auto space-y-6 bg-[#dedede] backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-black/10 ring-1 ring-black/5">'
);

// For ranking, the wrapper is already the bg-[#1E3D2F]/90 one, so we just replace the bg.
content = content.replace(
  /className=\{`bg-\[#1E3D2F\]\/90 backdrop-blur-xl p-6 rounded-\[2\.5rem\] shadow-2xl border border-white\/10 ring-1 ring-white\/5 overflow-hidden`\}/g,
  'className={`bg-[#dedede] backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-black/10 ring-1 ring-black/5 overflow-hidden`}'
);

fs.writeFileSync('src/App.tsx', content);
