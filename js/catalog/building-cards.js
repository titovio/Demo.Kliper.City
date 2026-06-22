(function () {
  'use strict';

  var HEART_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var BELL_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  var COMMENT_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var PIN_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  var FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494522358652-f30e61a60313?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop'
  ];

  function getBuildingImage(b) {
    if (b.imageUrl && b.imageUrl.indexOf('photo-1') !== -1) return b.imageUrl;
    return FALLBACK_IMAGES[b.id % FALLBACK_IMAGES.length];
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function renderBuildingCard(b) {
    var tagHtml = '';
    if (b.zone) {
      tagHtml = '<span class="kliper-card-status-badge">' + escapeHtml(b.zone) + '</span>';
    }

    var infoLine = '';
    if (b.year) infoLine += 'сдача ' + b.year;
    if (b.price) infoLine += (infoLine ? ' · ' : '') + b.price;

    return '<article class="kliper-card" role="button" aria-label="Открыть карточку ' + escapeHtml(b.name) + '">' +
      '<div class="kliper-card-image">' +
        '<img src="' + escapeHtml(getBuildingImage(b)) + '" alt="" loading="lazy">' +
      '</div>' +
      '<span class="kliper-card-badge-profile">' + escapeHtml(b.zone || 'город') + '</span>' +
      '<div class="kliper-card-content">' +
        '<div class="kliper-card-districts">' + PIN_SVG + ' ' + escapeHtml(b.district) + '</div>' +
        '<h3 class="kliper-card-name">' + escapeHtml(b.name) + '</h3>' +
        (infoLine ? '<div class="kliper-card-badges"><span class="kliper-card-status-badge">' + escapeHtml(infoLine) + '</span></div>' : '') +
      '</div>' +
      '<div class="kliper-card-footer">' +
        '<span class="kliper-card-counter">' + HEART_SVG + ' ' + (b.likes || 0) + '</span>' +
        '<span class="kliper-card-counter">' + BELL_SVG + ' ' + (b.notifications || 0) + '</span>' +
        '<span class="kliper-card-counter">' + COMMENT_SVG + ' ' + (b.comments || 0) + '</span>' +
      '</div>' +
    '</article>';
  }

  function filterBuildings(viewType) {
    var buildings = window.KLIPER_BUILDINGS || [];
    if (viewType === 'novostroyki') {
      return buildings.filter(function (b) { return b.status !== 'сдан' && b.status !== 'готов'; });
    }
    if (viewType === 'gotovye') {
      return buildings.filter(function (b) { return b.status === 'сдан' || b.status === 'готов'; });
    }
    if (viewType === 'business') {
      return buildings.filter(function (b) {
        return b.tags && b.tags.indexOf('коммерция') !== -1;
      });
    }
    return buildings;
  }

  function renderGrid(containerId, viewType) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var buildings = filterBuildings(viewType);

    var countEl = document.getElementById('kliper-card-count');
    if (countEl) countEl.textContent = buildings.length + ' карточек';

    if (!buildings.length) {
      container.innerHTML = '<div style="text-align:center;padding:60px 20px;">' +
        '<div style="font-size:48px;margin-bottom:16px;">🏗</div>' +
        '<h3 style="font-size:18px;font-weight:900;color:#334155;margin:0 0 8px;">Скоро здесь появятся объекты</h3>' +
        '<p style="font-size:14px;color:#94a3b8;">Данные загружаются...</p>' +
      '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < buildings.length; i++) {
      html += renderBuildingCard(buildings[i]);
    }
    container.innerHTML = html;
  }

  window.KLIPER_RENDER = window.KLIPER_RENDER || {};
  window.KLIPER_RENDER.buildings = renderGrid;
})();
