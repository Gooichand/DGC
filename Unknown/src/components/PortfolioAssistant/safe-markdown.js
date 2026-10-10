// Safe, dependency-free Markdown -> HTML renderer for the assistant chat.
//
// Everything is HTML-escaped (including quotes) BEFORE any formatting is applied,
// and link targets are restricted to safe schemes. Assistant output therefore
// cannot inject tags, attributes, event handlers, or javascript: URLs.
(function (root) {
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Allow only http(s), mailto, page anchors, and relative paths. Everything
  // else (javascript:, data:, vbscript:, ...) degrades to "#".
  function safeHref(url) {
    const cleaned = String(url).replace(/[\u0000-\u0020\u007f]/g, '');
    return /^(https?:\/\/|mailto:|\/|#|\.)/i.test(cleaned) ? url : '#';
  }

  function renderSafeMarkdown(text) {
    if (!text) return '';

    let html = escapeHtml(text)
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, function (_match, label, url) {
        return '<a href="' + safeHref(url) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
      })
      .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul>/g, '\n')
      .replace(/\n\|(.*)\|\n/g, function (match) {
        if (match.includes('---')) return '';
        const cells = match
          .split('|')
          .filter(function (c) { return c.trim() !== ''; })
          .map(function (c) { return '<td>' + c.trim() + '</td>'; })
          .join('');
        return '<tr>' + cells + '</tr>';
      })
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    if (html.includes('<tr>')) {
      html = html.replace(/(<tr>.*?<\/tr>)/g, '<table class="chat-table"><tbody>$1</tbody></table>');
      html = html.replace(/<\/tbody><\/table><table class="chat-table"><tbody>/g, '');
    }

    return ('<p>' + html + '</p>').replace(/<p><\/p>/g, '');
  }

  root.renderSafeMarkdown = renderSafeMarkdown;
  if (typeof module !== 'undefined' && module.exports) module.exports = renderSafeMarkdown;
})(typeof window !== 'undefined' ? window : globalThis);
