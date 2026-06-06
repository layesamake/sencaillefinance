const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-gray-950': 'bg-background',
  'bg-gray-900': 'bg-surface',
  'bg-gray-800': 'bg-surface-hover',
  'border-gray-800': 'border-border',
  'border-gray-700': 'border-border',
  'text-gray-50': 'text-primary-text',
  'text-gray-100': 'text-primary-text',
  'text-gray-200': 'text-primary-text',
  'text-gray-300': 'text-primary-text',
  'text-gray-400': 'text-muted',
  'text-gray-500': 'text-muted',
  'text-white': 'text-primary-text',
  'bg-blue-600': 'bg-accent',
  'hover:bg-blue-700': 'hover:bg-accent-hover',
  'text-blue-500': 'text-accent',
  'text-blue-400': 'text-accent',
  'text-blue-300': 'text-accent',
  'text-red-500': 'text-danger',
  'text-red-400': 'text-danger',
  'bg-red-500': 'bg-danger',
  'text-emerald-500': 'text-success',
  'text-emerald-400': 'text-success',
  'bg-emerald-500': 'bg-success',
  'text-green-500': 'text-success',
  'text-green-400': 'text-success',
  'bg-green-500': 'bg-success',
  'text-amber-500': 'text-warning',
  'text-amber-400': 'text-warning',
  'bg-amber-500': 'bg-warning',
  'hover:text-white': 'hover:text-primary-text',
  'hover:bg-gray-800': 'hover:bg-surface-hover',
  'hover:bg-gray-900': 'hover:bg-surface',
  'focus:border-blue-500': 'focus:border-accent',
  'focus:ring-blue-500': 'focus:ring-accent',
};

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync('d:/dev/antigravity/sencaillefinances/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    newContent = newContent.replace(regex, value);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
