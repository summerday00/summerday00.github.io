'use strict';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

hexo.extend.generator.register('sitemap-page', function(locals) {
  const posts = locals.posts.sort('-date').toArray();
  const excludedPages = new Set(['tags/index.md', 'categories/index.md']);
  const pages = locals.pages
    .filter(page => !page.noindex && page.sitemap !== false && !excludedPages.has(page.source))
    .sort('date')
    .toArray();

  const years = new Map();
  for (const post of posts) {
    const year = post.date.year();
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(post);
  }

  const pageItems = pages.map(page => `
    <li>
      <a href="${page.permalink}">${escapeHtml(page.title)}</a>
      <span class="sitemap-meta">页面</span>
    </li>`).join('');

  const postItems = [...years.entries()].map(([year, list]) => `
    <section class="sitemap-section">
      <h2 class="sitemap-year">${year}</h2>
      <ul class="sitemap-list">
        ${list.map(post => `
        <li>
          <a href="${post.permalink}">${escapeHtml(post.title)}</a>
          <span class="sitemap-meta">${post.date.format('YYYY-MM-DD')}</span>
        </li>`).join('')}
      </ul>
    </section>`).join('');

  const content = `<div class="sitemap-page">
    <p class="sitemap-intro">这里汇总了博客的全部公开页面与文章。</p>
    <section class="sitemap-section">
      <h2 class="sitemap-year">页面</h2>
      <ul class="sitemap-list">${pageItems || '<li>暂无</li>'}</ul>
    </section>
    ${postItems || '<p>暂无文章</p>'}
  </div>`;

  return {
    path: 'sitemap/index.html',
    layout: 'page',
    data: {
      title: '站点地图',
      content
    }
  };
});
