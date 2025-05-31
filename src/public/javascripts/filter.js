function applyFilters() {
  const courseFilter = document.getElementById('courseFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.delete('page');

  if (courseFilter) {
    currentUrl.searchParams.set('course', courseFilter);
  } else {
    currentUrl.searchParams.delete('course');
  }

  if (statusFilter) {
    currentUrl.searchParams.set('status', statusFilter);
  } else {
    currentUrl.searchParams.delete('status');
  }

  window.location.href = currentUrl.toString();
}

function filterMyCourses() {
  const levelFilter = document.getElementById('levelFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  const currentUrl = new URL(window.location.href);

  if (levelFilter) {
    currentUrl.searchParams.set('level', levelFilter);
  } else {
    currentUrl.searchParams.delete('level');
  }

  if (statusFilter) {
    currentUrl.searchParams.set('status', statusFilter);
  } else {
    currentUrl.searchParams.delete('status');
  }

  window.location.href = currentUrl.toString();
}
