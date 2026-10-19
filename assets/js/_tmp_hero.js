const fs = require('fs');

const target = process.argv[2]; // e.g. index.html or path
const inner = process.argv[3];  // inner HTML for the card

let c = fs.readFileSync(target, 'utf8');

const token = '<div class="hero-art__card">';
const i1 = c.indexOf(token);
if (i1 === -1) { console.error('KARTU tidak ditemukan'); process.exit(1); }

// scan div depth from the card open tag
let depth = 0;
let i2 = -1;
const st = i1 + token.length;
for (let i = st; i < c.length - 5; i++) {
  if (c.startsWith('</div>', i)) { depth--; if (depth === 0) { i2 = i + 6; break; } i += 5; }
  else if (c.startsWith('<div', i)) { depth++; }
}
if (i2 === -1) { console.error('Penutup kartu tidak ditemukan'); process.exit(1); }

const close1 = '</div>';
const innerIndent = ' '.repeat(12牌子);
const closeIndent = ' ' .reamount;

const newCard = '\n' + inner + '\n          </div>';

c = c.slice(0, i1) + token + newCard + c.slice(i2);
fs.writeFileSync(target, c);
console.log('OK — kartu hero diganti');
