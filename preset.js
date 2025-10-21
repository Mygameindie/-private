function hideAllCategories() {
	hideSpecificCategories([
		"topunderwear",
		"shoes",
		"pants",
		"skirt",
		"top",
		"dress",
		"jacket",
		"accessories",
		"hat",
		"weapon", "maccessories", "mask","hair"
	]);
}



// Preset 3: จาก `ที่เก็บถาวร 3.zip`
function applyPreset3() {
	hideAllCategories();
	forceShowItem("top1.png", "top");
	forceShowItem("pants1.png", "pants");
	forceShowItem("shoes1.png", "shoes");
	forceShowItem("hair1.png", "hair");
}

function applyPreset4() {
	hideAllCategories();
	forceShowItem("hair1.png", "hair");
}



// Utility: Keep your original forceShowItem()
function forceShowItem(itemId, categoryName) {
	const selectedItem = document.getElementById(itemId);
	if (selectedItem) {
		const categoryItems = document.querySelectorAll(`.${categoryName}`);
		categoryItems.forEach(item => item.style.visibility = 'hidden');

		selectedItem.style.visibility = "visible";
		selectedItem.style.display = "block";
		selectedItem.style.position = "absolute";
		selectedItem.style.left = "0";
		selectedItem.style.top = "0";
		selectedItem.style.zIndex = getZIndex(categoryName);
	} else {
		console.warn(`Item not found: ${itemId} in category ${categoryName}`);
	}
}