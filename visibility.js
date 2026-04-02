// visibility.js
(function(){
  function hideSpecificCategories(categories) {
    categories.forEach(category => {
      const items = document.querySelectorAll(`.${category}`);
      items.forEach(item => {
        item.style.visibility = 'hidden';
      });
    });
  }
  window.hideSpecificCategories = hideSpecificCategories;

  function toggleVisibility(itemId, categoryName) {
    const nonRemovableCategories = ['bottomunderwear', 'face'];

    // Auto-scroll to the item's category heading
    const allHeadings = document.querySelectorAll('.category h3');
    allHeadings.forEach(heading => {
      if (heading.textContent.trim() === categoryName.trim()) {
        heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
      if (item.id !== itemId) {
        item.style.visibility = 'hidden';
      }
    });

    const selectedItem = document.getElementById(itemId);
    if (!selectedItem) return;

    if (nonRemovableCategories.includes(categoryName)) {
      // Always make visible (force it on)
      selectedItem.style.visibility = 'visible';
    } else {
      // Toggle normally
      selectedItem.style.visibility = selectedItem.style.visibility === 'visible' ? 'hidden' : 'visible';
    }

    if (selectedItem.style.visibility === 'visible') {
      if (categoryName === 'dress') {
        // Wearing a dress: hide shirts, pants, skirts, sweatshirts, and underwear
        hideSpecificCategories(['top', 'pants', 'skirt', 'sweatshirt', 'topunderwear']);
      } else if (
        categoryName === 'top' || categoryName === 'top' ||
        categoryName === 'pants' || categoryName === 'pants' ||
        categoryName === 'skirt' || categoryName === 'skirt' ||
        categoryName === 'sweatshirt'
      ) {
        // Wearing any top/pants/skirt/sweatshirt: hide dress
        hideSpecificCategories(['dress']);
      }
    }

    if (categoryName === 'maccessories') {
      hideSpecificCategories(['dress']);
    } else if (categoryName === 'dress') {
      hideSpecificCategories(['maccessories']);
    }
  }

  window.toggleVisibility = toggleVisibility;
})();
