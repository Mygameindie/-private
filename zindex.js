// zindex.js
(function () {
  function getZIndex(categoryName) {
    const zIndexMap = {
      backitem:       1,
      face:           11,
      hair:           12,
      bottomunderwear: 30,
      topunderwear:   40,
      shoes:          50,
      pants:          60,
      skirt:          61,
      top:            70,
      dress:          90,
      jacket:         100,
      accessories:    110,
      hat:            120,
      plants:         130,
      weapon:         140,
      maccessories:   150,
      waist:          160,
      mask:           165,
      emotion:        999
    };
    return zIndexMap[categoryName] || 0;
  }
  window.getZIndex = getZIndex;
})();
