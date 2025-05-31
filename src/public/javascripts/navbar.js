function toggleMenu() {
  const menu = document.getElementById('navbar-cta');
  const isExpanded = menu.classList.toggle('hidden');
  // Update aria-expanded attribute
  const button = document.querySelector('button[data-collapse-toggle="navbar-cta"]');
  button.setAttribute('aria-expanded', !isExpanded);
}

function toggleDropdown() {
  const dropdown = document.getElementById('languageMenu');
  dropdown.classList.toggle('hidden');
  const button = document.getElementById('languageDropdown');
  const isExpanded = dropdown.classList.contains('hidden');
  button.setAttribute('aria-expanded', !isExpanded);
}

function selectLanguage(lang, flagSrc, langText) {
  const flagImg = document.getElementById('selectedLanguageFlag');
  const langSpan = document.getElementById('selectedLanguageText');
  flagImg.src = flagSrc;
  flagImg.alt = langText;
  langSpan.textContent = langText;

  // Lấy URL hiện tại và tham số tìm kiếm
  const url = new URL(window.location.href);
  const keyword = url.searchParams.get('keyword');
  url.searchParams.set('lng', lang);
  if (keyword) {
    url.searchParams.set('keyword', keyword);
  }
  window.location.href = url.toString();
  toggleDropdown();
}

function toggleUserMenu() {
  const userMenu = document.getElementById('userMenu');
  userMenu.classList.toggle('hidden');
  const button = document.getElementById('userAvatar');
  const isExpanded = !userMenu.classList.contains('hidden');
  button.setAttribute('aria-expanded', isExpanded);
}

// Close the language menu and user menu when clicking outside
window.addEventListener('click', function (e) {
  const languageMenu = document.getElementById('languageMenu');
  const languageButton = document.getElementById('languageDropdown');
  const userMenu = document.getElementById('userMenu');
  const userButton = document.getElementById('userAvatar');

  if (!languageMenu.contains(e.target) && !languageButton.contains(e.target)) {
    languageMenu.classList.add('hidden');
    languageButton.setAttribute('aria-expanded', 'false');
  }

  if (!userMenu.contains(e.target) && !userButton.contains(e.target)) {
    userMenu.classList.add('hidden');
    userButton.setAttribute('aria-expanded', 'false');
  }
});
