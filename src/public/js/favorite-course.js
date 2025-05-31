document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('favorite-btn');
  if (!btn) return;
  const courseId = window.location.pathname.split('/').filter(Boolean).pop();

  btn.addEventListener('click', async function () {
    const isFavorited = btn.getAttribute('data-favorited') === 'true';
    try {
      const res = await fetch(`/courses/${courseId}/favorite`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      if (res.ok) {
        btn.setAttribute('data-favorited', (!isFavorited).toString());
        const icon = btn.querySelector('i');
        if (!isFavorited) {
          icon.classList.remove('far', 'text-gray-400');
          icon.classList.add('fas', 'text-red-500');
          icon.setAttribute('title', btn.dataset.unfavorite || 'Bỏ yêu thích');
        } else {
          icon.classList.remove('fas', 'text-red-500');
          icon.classList.add('far', 'text-gray-400');
          icon.setAttribute('title', btn.dataset.favorite || 'Yêu thích');
        }
      }
    } catch (e) {
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  });
});
