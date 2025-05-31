const selectedItems = document.querySelector('.selected-items');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const searchInput = document.getElementById('searchInput');
const lessonIds = document.getElementById('lessons');

function filterItems(searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();
  dropdownItems.forEach((item) => {
    const itemText = item.querySelector('option').textContent.toLowerCase();
    if (itemText.includes(lowerSearchTerm)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function resetSearchInput() {
  searchInput.focus();
  searchInput.value = '';
  filterItems('');
}

function disableButton() {
  const saveButton = document.getElementById('saveButton');
  saveButton.disabled = true;
}

function toggleDeleteModal() {
  const modal = document.querySelector('#modal');
  modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

dropdownToggle.addEventListener('click', () => {
  dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
  resetSearchInput();
});

selectedItems.addEventListener('click', () => {
  dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
  resetSearchInput();
});

dropdownItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const itemText = item.querySelector('option').textContent;
    const itemValue = item.querySelector('option').value;

    const lessonIdsArray = lessonIds.value.split(', ');
    const selectedItemsList = selectedItems.value.split(', ');
    if (lessonIdsArray[0] === '') {
      lessonIdsArray.pop();
      selectedItemsList.pop();
    }

    const lessonIdIndex = lessonIdsArray.indexOf(itemValue);
    const itemIndex = selectedItemsList.indexOf(itemText);
    if (lessonIdIndex === -1) {
      selectedItemsList.push(itemText);
      lessonIdsArray.push(itemValue);
      item.innerHTML = `<div class="mr-2 text-blue-500">✓</div><option class="text-blue-500" value=${itemValue}>${itemText}</option>`;
    } else {
      selectedItemsList.splice(itemIndex, 1);
      lessonIdsArray.splice(lessonIdIndex, 1);
      item.innerHTML = `<option value=${itemValue}>${itemText}</option>`;
    }
    selectedItems.value = selectedItemsList.join(', ');
    lessonIds.value = lessonIdsArray.join(', ');
  });
});

searchInput.addEventListener('input', (e) => {
  filterItems(e.target.value);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

window.addEventListener('click', (e) => {
  if (!dropdownMenu.contains(e.target) && e.target !== selectedItems && e.target !== dropdownToggle) {
    dropdownMenu.style.display = 'none';
    resetSearchInput();
  }
});
