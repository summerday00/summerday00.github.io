'use strict';

const fs = require('fs');
const path = require('path');

// hexo-tag-aplayer 在 Windows 下会把资源路径生成为 \assets\js\...，
// 浏览器无法识别，这里统一修正为 /assets/js/...
hexo.extend.filter.register('after_generate', () => {
  const publicDir = hexo.public_dir;
  const files = [];

  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(full);
      }
    }
  };

  if (fs.existsSync(publicDir)) walk(publicDir);

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const fixed = html.replace(/(href|src)="\\assets\\/g, '$1="/assets/');
    if (fixed !== html) {
      fs.writeFileSync(file, fixed);
      hexo.log.info(`[fix-aplayer] fixed: ${file}`);
    }
  }
});
