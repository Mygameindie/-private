// data_loader.js
(function(){
  // Array of JSON file paths
  const jsonFiles = [
    'emotion.json',
    'backitem.json',
    'hair.json',
    'face.json',
    'bottomunderwear.json',
    'topunderwear.json',
    'shoes.json',
    'pants.json',
    'top.json',
    'skirt.json',
    'dress.json',
    'jacket.json',
    'accessories.json',
    'maccessories.json',
    'hat.json',
    'weapon.json',
    'mask.json',
    'Waist.json',
  ];

  // Load each JSON file (deduped: your original had this function twice)
  async function loadItemFile(file) {
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Error loading file: ${file}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to load ${file}:`, error);
      return [];
    }
  }

  // Load items in batches to reduce load time and improve responsiveness
  async function loadItemsInBatches(batchSize = 3) {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    for (let i = 0; i < jsonFiles.length; i += batchSize) {
      const batch = jsonFiles.slice(i, i + batchSize);

      await Promise.all(batch.map(async file => {
        const data = await loadItemFile(file);
        const categoryName = file.replace('.json', '');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category');

        const categoryHeading = document.createElement('h3');
        categoryHeading.textContent = categoryName;
        categoryContainer.appendChild(categoryHeading);

        data.forEach(item => {
          const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

          const img = document.createElement('img');
          img.id = itemId;
          img.src = item.src;
          img.alt = item.alt;
          img.classList.add(categoryName);
          img.setAttribute('data-file', file);
          img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
          img.style.position = 'absolute';
          img.style.zIndex = getZIndex(categoryName);
          baseContainer.appendChild(img);

          // Create container for buttons
          const buttonContainer = document.createElement('div');
          buttonContainer.classList.add('button-container');

          // Create a wrapper to stack buttons vertically
          const buttonWrap = document.createElement('div');
          buttonWrap.classList.add('button-wrap');

          // Main item button
          const button = document.createElement('img');
          const buttonFile = item.src.replace('.png', 'b.png');
          button.src = buttonFile;
          button.alt = item.alt + ' Button';
          button.classList.add('item-button');
          button.onclick = () => toggleVisibility(itemId, categoryName);
          buttonWrap.appendChild(button);

          // Add stacked buttonWrap to container
          buttonContainer.appendChild(buttonWrap);
          categoryContainer.appendChild(buttonContainer);
        });

        controlsContainer.appendChild(categoryContainer);
      }));

      await new Promise(resolve => setTimeout(resolve, 0.1));
    }
  }

  window.loadItemsInBatches = loadItemsInBatches;
})();
