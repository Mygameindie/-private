// zindex.js
(function(){
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
  window.getZIndex = getZIndex;
})();
