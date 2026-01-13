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
		"weapon", "maccessories", "mask","backitem","Waist"
	]);
}
// Preset 3: จาก `ที่เก็บถาวร 3.zip`
function applyPreset1() {
	hideAllCategories();
	forceShowItem("top1.png", "top");
	forceShowItem("pants1.png", "pants");
	forceShowItem("hair1.png", "hair");
  forceShowItem("backitem1.png", "backitems");
  forceShowItem("shoes2.png", "shoes");
  forceShowItem("skirt2.png", "skirt");
  forceShowItem("accessories1.png", "accessories");
  forceShowItem("hat1.png", "hat");
  forceShowItem("mask1.png", "mask");
	
}

function applyPreset2() {
    hideAllCategories();
    forceShowItem("dress1.png", "dress");
    forceShowItem("shoes3.png", "shoes");

    forceShowItem("hat3.png", "hat");
    forceShowItem("backitem2.png", "backitems");
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
	forceShowItem("bottomunderwear1.png", "bottomunderwear")
}
// Preset 4: จาก `ที่เก็บถาวร 3.zip`
function applyPreset5() {
    hideAllCategories();
    forceShowItem("top3.png", "top");
    forceShowItem("pants3.png", "pants");
    forceShowItem("hat6.png", "hat");
    forceShowItem("weapon10.png", "weapon");
    forceShowItem("backitem3.png", "backitem");
	forceShowItem("shoes1.png", "shoes")
}
// Preset 6
function applyPreset6() {
    hideAllCategories();
    forceShowItem("topunderwear2.png", "topunderwear");
    forceShowItem("bottomunderwear2.png", "bottomunderwear");
    forceShowItem("hat8.png", "hat");
    forceShowItem("backitem4.png", "backitem");
}
// Preset Teto
function applyPreset7() {
    hideAllCategories();
    forceShowItem("hair3.png", "hair");
    forceShowItem("top4.png", "top");
    forceShowItem("skirt1.png", "skirt");
    forceShowItem("shoes4.png", "shoes");
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