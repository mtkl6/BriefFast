// PDF Theme configurations inspired by DaisyUI themes
export interface PdfTheme {
  name: string;
  background: string; // Hex color
  text: string; // Hex color
  headings: string; // Hex color
  accent: string; // Hex color
  borders: string; // Hex color
  description: string;
}

// Convert hex to RGB array for jsPDF
export function hexToRgb(hex: string): [number, number, number] {
  const hexValue = hex.replace(/^#/, "");
  const bigint = Number.parseInt(hexValue, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// PDF Theme options
export const pdfThemes: PdfTheme[] = [
  {
    name: "light",
    background: "#ffffff",
    text: "#1f2937",
    headings: "#111827",
    accent: "#3b82f6",
    borders: "#e5e7eb",
    description: "Clean light theme with black text",
  },
  {
    name: "dark",
    background: "#1d232a",
    text: "#e5e7eb",
    headings: "#f3f4f6",
    accent: "#661AE6",
    borders: "#374151",
    description: "Dark theme with light text",
  },
  {
    name: "cupcake",
    background: "#faf7f5",
    text: "#291334",
    headings: "#4b5563",
    accent: "#ef9fbc",
    borders: "#e5dad2",
    description: "Pastel colors with pink accents",
  },
  {
    name: "bumblebee",
    background: "#ffffff",
    text: "#181830",
    headings: "#000000",
    accent: "#f5d60a",
    borders: "#e5e7eb",
    description: "Black and yellow theme",
  },
  {
    name: "emerald",
    background: "#ffffff",
    text: "#333c4d",
    headings: "#107568",
    accent: "#66CC8A",
    borders: "#e5e7eb",
    description: "Green-based theme with clean look",
  },
  {
    name: "corporate",
    background: "#ffffff",
    text: "#1d232a",
    headings: "#1e293b",
    accent: "#4b6bfb",
    borders: "#cbd5e1",
    description: "Professional blue and white theme",
  },
  {
    name: "synthwave",
    background: "#2d1b69",
    text: "#f9f7fd",
    headings: "#f9f7fd",
    accent: "#e779c1",
    borders: "#4a3c90",
    description: "Retrowave with bright pink and purple",
  },
  {
    name: "retro",
    background: "#e8e2d6",
    text: "#40342c",
    headings: "#272625",
    accent: "#ef8464",
    borders: "#d3cabd",
    description: "Vintage theme with warm, earthy tones",
  },
  {
    name: "cyberpunk",
    background: "#ffee00",
    text: "#140741",
    headings: "#000000",
    accent: "#ff0055",
    borders: "#ffdd00",
    description: "Bright yellow with neon pink accents",
  },
  {
    name: "valentine",
    background: "#ffdbe7",
    text: "#4b384c",
    headings: "#4b384c",
    accent: "#e96d9a",
    borders: "#f5c8da",
    description: "Pink theme with soft colors",
  },
  {
    name: "halloween",
    background: "#171618",
    text: "#f7f5f2",
    headings: "#f7f5f2",
    accent: "#ff7a1a",
    borders: "#2e2c2f",
    description: "Dark theme with orange accents",
  },
  {
    name: "lofi",
    background: "#ffffff",
    text: "#1f2937",
    headings: "#000000",
    accent: "#0d0d0d",
    borders: "#e5e7eb",
    description: "Monochrome black and white theme",
  },
  {
    name: "dracula",
    background: "#282a36",
    text: "#f8f8f2",
    headings: "#ff79c6",
    accent: "#bd93f9",
    borders: "#44475a",
    description: "Dark theme with vivid purple and pink",
  },
  {
    name: "business",
    background: "#1C212B",
    text: "#D1D5DB",
    headings: "#ffffff",
    accent: "#4891EB",
    borders: "#374151",
    description: "Dark business theme with blue accents",
  },
  {
    name: "night",
    background: "#0c1222",
    text: "#e4e7ec",
    headings: "#f0f1f4",
    accent: "#39b5fd",
    borders: "#192032",
    description: "Dark blue theme with bright accents",
  },
  {
    name: "coffee",
    background: "#20161f",
    text: "#e2d6cf",
    headings: "#fbf2ea",
    accent: "#dc944c",
    borders: "#362c34",
    description: "Warm dark brown theme with coffee accents",
  },
];
