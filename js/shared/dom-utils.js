(function () {
  function text(node) {
    return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
      return;
    }
    callback();
  }

  function toArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  window.KLIPER_DOM = {
    text: text,
    escapeHtml: escapeHtml,
    onReady: onReady,
    toArray: toArray
  };
})();
