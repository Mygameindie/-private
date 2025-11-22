// Array of JSON file paths
const jsonFiles = [
	'emotion.json',
'backitem.json',
    'hair.json',
	'face.json',
	'bottomunderwear.json', 
    'topunderwear.json' ,
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



// Track currently selected item for color changing
let currentlySelectedItem = null;

// Helper function to set z-index for categories
function getZIndex(categoryName) {
    const zIndexMap = {
		backitem:1,
        hair: 12,
        face: 11,
        bottomunderwear: 30,
        topunderwear: 40,
        shoes: 50,
        pants: 60,
		skirt:61,
        waist: 160,
        top: 70,
        dress: 90,
        jacket: 100,
        accessories: 110,
        hat: 120,
        plants: 130,
        weapon: 140,
		maccessories: 150,
		mask:160,
		Waist:161,
		emotion: 999
		
    };
    return zIndexMap[categoryName] || 0;
}

// Load each JSON file
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
// Load each JSON file
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
        // Wearing a dress: hide shirts, pants, skirts, sweatshirts, and underwear
        hideSpecificCategories(['dress']);
    } else if (
	categoryName === 'dress'
    ) {
        // Wearing any top/pants/skirt/sweatshirt: hide dress
        hideSpecificCategories(['maccessories']);
    }

}
// Helper function to hide items for specific categories
function hideSpecificCategories(categories) {
    categories.forEach(category => {
        const items = document.querySelectorAll(`.${category}`);
        items.forEach(item => {
            item.style.visibility = 'hidden';
        });
    });
}

function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    const screenWidth = window.innerWidth;

    requestAnimationFrame(() => {
        if (screenWidth <= 600) {
            baseContainer.classList.add('mobile-layout');
            baseContainer.classList.remove('desktop-layout');
            controlsContainer.classList.add('mobile-controls');
            controlsContainer.classList.remove('desktop-controls');
        } else {
            baseContainer.classList.add('desktop-layout');
            baseContainer.classList.remove('mobile-layout');
            controlsContainer.classList.add('desktop-controls');
            controlsContainer.classList.remove('mobile-controls');
        }
    });
}


// Music control logic
function setupMusicToggle() {
    const audio = document.getElementById("backgroundMusic");
    const button = document.getElementById("musicToggleButton");
    let isPlaying = false;

    button.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            button.textContent = "🔇 Music Off";
        } else {
            audio.play();
            button.textContent = "🔊 Music On";
        }
        isPlaying = !isPlaying;
    });
}
function setupMusicSelector() {
    const selector = document.getElementById("musicSelector");
    const audio = document.getElementById("backgroundMusic");
    const source = audio.querySelector("source");

   selector.addEventListener("change", () => {
    const selectedTrack = selector.value;
    source.src = selectedTrack;
    audio.load();
    audio.play().catch(e => console.warn("Playback issue:", e));

    const button = document.getElementById("musicToggleButton");
    if (button) button.textContent = "🔊 Music On";

    // 🌿 Automatically change plants to plants6.png when Track 4 is selected
    if (selectedTrack === "my-music3.mp3") {
        // Hide all other plant items
        const plantItems = document.querySelectorAll(".plants");
        plantItems.forEach(item => item.style.visibility = "hidden");

        
			
        }
    
    });
}
function setupButterToggle() {
    const butterImg = document.getElementById("butter1");
    const toggleBtn = document.getElementById("toggleButterBtn");

    if (!butterImg || !toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        const isVisible = butterImg.style.display === "block";
        butterImg.style.display = isVisible ? "none" : "block";
    });
}

window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout();
    setupMusicToggle();
    setupMusicSelector(); // 👈 this line
	setupButterToggle();
};

window.addEventListener('resize', adjustCanvasLayout);

function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';

    const audio = document.getElementById("backgroundMusic");
    if (audio) {
        audio.play().catch(e => console.warn("Autoplay blocked:", e));
        const button = document.getElementById("musicToggleButton");
        if (button) button.textContent = "🔊 Music On";
    }
}

// Function to remove focus from button after interaction
function blurButton(event) {
    event.preventDefault(); // Prevent default focus behavior
    event.target.blur(); // Remove focus from the button
}

// Function for Button 1: Show Base2 on press, hide on release
function pressButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "block";
}

function releaseButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "none";
}

// Function for Button 2: Show Base3 on press, hide on release
function pressButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "block";
}

function releaseButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "none";
}



window.getZIndex = getZIndex;

