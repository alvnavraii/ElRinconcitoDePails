// Funciones de utilidad para categorías
export const processCategories = (data) => {
  console.log('Datos recibidos en processCategories:', data);
  
  if (!Array.isArray(data)) {
    console.error('Los datos recibidos no son un array:', data);
    return [];
  }
  
  // Procesamiento más detallado
  const processed = data.map(cat => {
    const displayName = cat.name || 
                        (cat.slug ? cat.slug.charAt(0).toUpperCase() + cat.slug.slice(1) : 
                        `Categoría ${cat.id}`);
    
    const parentId = cat.parentId || (cat.parent ? cat.parent.id : null);
    
    console.log(`Procesando categoría: ID=${cat.id}, Nombre=${displayName}, ParentID=${parentId}`);
    
    return {
      ...cat,
      displayName,
      parentId
    };
  });
  
  console.log('Categorías procesadas:', processed);
  return processed;
};

// Función para construir un árbol de categorías
export const buildCategoryTree = (categories) => {
  // Si los datos ya están anidados, simplemente devuélvelos
  return categories;
};

// Función para aplanar un árbol de categorías
export const flattenCategoryTree = (tree, level = 0) => {
  return tree.reduce((acc, node) => {
    const flatNode = { ...node, level };
    return [
      ...acc,
      flatNode,
      ...flattenCategoryTree(node.children || [], level + 1)
    ];
  }, []);
}; 