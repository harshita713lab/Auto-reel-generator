/**
 * Centralized mapping of Template IDs / Names to their exact required image count.
 * All compositions expect exact image counts as exported in their respective Remotion components.
 */

const TEMPLATE_IMAGE_COUNTS = {
  // Numeric string & alias keys
  '1': 14,
  '2': 13,
  '3': 11,
  '4': 5,
  '5': 5,
  '6': 12,
  '7': 8,
  '8': 17,
  '9': 15,
  '10': 16,
  '11': 18,
  '12': 23,
  '13': 4,
  '14': 11,
  '15': 4,
  '16': 13,
  '17': 12,
  '18': 17,
  '19': 7,
  '20': 14,
  '21': 3,
  '22': 4,
  '23': 14,
  '24': 14,
  '25': 24,
  '26': 9,
  '27': 9,
  '28': 22,
  '29': 9,
  '30': 8,
  '31': 8,
  '32': 25,
  '33': 4,
  '34': 19,

  // Named aliases
  'simple_1': 14,
  'wedding_seq': 14,
  'cinematic_wedding': 15,
  'wedding_split': 11,
  'white_carousel': 16,
  'white_masonry': 8,
  'white_polaroid': 18,
  'premium_grid': 4,
  'memory_blend': 14
};

// Auto-populate TemplateX and templateX variations
for (let i = 1; i <= 34; i++) {
  const count = TEMPLATE_IMAGE_COUNTS[String(i)];
  if (count !== undefined) {
    TEMPLATE_IMAGE_COUNTS[`Template${i}`] = count;
    TEMPLATE_IMAGE_COUNTS[`template${i}`] = count;
    TEMPLATE_IMAGE_COUNTS[`Tempalte${i}`] = count;
    TEMPLATE_IMAGE_COUNTS[`tempalte${i}`] = count;
  }
}

/**
 * Get exact required image count for a template.
 * Returns null if template ID is unknown or unlimited.
 */
function getRequiredImageCount(templateId) {
  if (!templateId) return null;
  if (TEMPLATE_IMAGE_COUNTS[templateId] !== undefined) {
    return TEMPLATE_IMAGE_COUNTS[templateId];
  }
  
  // Try extracting number from templateId string (e.g. "Template 25", "template_12")
  const match = String(templateId).match(/\d+/);
  if (match && TEMPLATE_IMAGE_COUNTS[match[0]] !== undefined) {
    return TEMPLATE_IMAGE_COUNTS[match[0]];
  }

  return null;
}

module.exports = {
  TEMPLATE_IMAGE_COUNTS,
  getRequiredImageCount
};
