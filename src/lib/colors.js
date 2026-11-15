// Colour-name → hex, mirroring the backend palette (database/data/catalog.json).
// Variations carry only the colour name, so this lets the storefront draw real
// swatches. Unknown names fall back to a neutral dot.
export const COLOR_HEX = {
  Ecru: '#E9E2D0',
  Bone: '#F0EBE0',
  Oatmeal: '#D8CDB8',
  Sand: '#CBB893',
  Camel: '#B08A5E',
  Clay: '#A2705A',
  Stone: '#B9B2A6',
  Olive: '#5E6150',
  'Bottle Green': '#223B32',
  'Ink Blue': '#2C3550',
  Slate: '#5A6472',
  Oxblood: '#5A2A2E',
  Charcoal: '#36383B',
  Black: '#15161A',
};

export const colorHex = (name) => COLOR_HEX[name] || '#B9B2A6';
