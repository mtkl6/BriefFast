/**
 * Markdown formatting utilities for consistent brief generation
 */

/**
 * Creates a markdown section header
 */
export function section(title: string): string {
  return `\n## ${title}\n\n`;
}

/**
 * Creates a markdown field with label and value
 */
export function field(
  name: string,
  value: string | number | boolean | string[] | undefined | null
): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  // Handle arrays by converting them to joined strings
  if (Array.isArray(value)) {
    return `**${name}:** ${value.join(", ")}\n\n`;
  }

  return `**${name}:** ${value}\n\n`;
}

/**
 * Creates a markdown field only if the value exists
 */
export function conditionalField(
  name: string,
  value: string | number | boolean | string[] | undefined | null
): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  return field(name, value);
}

/**
 * Creates a markdown list from an array of items
 */
export function list(
  items: (string | number | boolean | undefined | null)[]
): string {
  const validItems = items.filter(
    (item) => item !== undefined && item !== null && item !== ""
  );
  if (validItems.length === 0) {
    return "";
  }

  return validItems.map((item) => `- ${item}\n`).join("") + "\n";
}

/**
 * Creates a markdown list from a record with labels
 */
export function mappedList(
  items: string[],
  labelMap: Record<string, string>,
  otherValue?: string | number | boolean | string[] | null | undefined,
  otherKey = "other"
): string {
  if (!items || items.length === 0) {
    return "";
  }

  return `${items
    .map((item) => {
      if (
        item === otherKey &&
        otherValue !== undefined &&
        otherValue !== null
      ) {
        if (Array.isArray(otherValue)) {
          return `- ${otherValue.join(", ")}\n`;
        }
        return `- ${String(otherValue)}\n`;
      }
      return `- ${labelMap[item] || item}\n`;
    })
    .join("")}\n`;
}

/**
 * Creates a complete markdown object with all utilities
 */
export const md = {
  section,
  field,
  conditionalField,
  list,
  mappedList,
};

export default md;
