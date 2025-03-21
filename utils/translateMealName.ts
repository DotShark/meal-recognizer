const translations: Record<string, string> = {
  'spaghetti_bolognese': 'Spaghetti bolognaise',
  'pizza': 'Pizza',
  'apple_pie': 'Tarte aux pommes',
  'hamburger': 'Hamburger',
  'ice_cream': 'Glace',
  'pad_thai': 'Pad thaï',
  'paella': 'Paëlla',
  'french_fries': 'Frites',
  'tiramisu': 'Tiramisu',
  'donuts': 'Beignets',
  'suhsi': 'Sushi',
  'omelette': 'Omelette'
}

export function translateMealName(label: string): string {
  return translations[label] || label  
}
