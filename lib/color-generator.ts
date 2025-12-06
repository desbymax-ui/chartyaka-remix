/**
 * Generates randomized color palettes with good contrast for text readability
 */

// HSL color generation for vibrant, well-contrasted colors
export function generateRandomPalette(count: number = 5): string[] {
    const colors: string[] = []
    const baseHues = shuffleArray([0, 30, 60, 120, 180, 210, 240, 270, 300, 330])

    for (let i = 0; i < count; i++) {
        const hue = baseHues[i % baseHues.length]
        const saturation = 60 + Math.random() * 30 // 60-90%
        const lightness = 45 + Math.random() * 15 // 45-60%

        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
    }

    return colors
}

// Predefined palettes with excellent contrast
export const contrastPalettes = {
    vibrant: [
        '#FF6B6B', // Red
        '#4ECDC4', // Teal
        '#45B7D1', // Blue
        '#FFA07A', // Orange
        '#98D8C8', // Mint
        '#F7DC6F', // Yellow
        '#BB8FCE', // Purple
        '#85C1E2', // Sky Blue
    ],
    professional: [
        '#2E86AB', // Deep Blue
        '#A23B72', // Magenta
        '#F18F01', // Orange
        '#C73E1D', // Red
        '#6A994E', // Green
        '#BC4B51', // Rose
        '#8B7E74', // Brown
        '#5E548E', // Purple
    ],
    modern: [
        '#E63946', // Crimson
        '#F1FAEE', // Mint Cream (light)
        '#A8DADC', // Powder Blue
        '#457B9D', // Steel Blue
        '#1D3557', // Dark Blue
        '#F77F00', // Orange
        '#06FFA5', // Mint
        '#D62828', // Red
    ],
    warm: [
        '#E76F51', // Burnt Sienna
        '#F4A261', // Sandy Brown
        '#E9C46A', // Maize
        '#2A9D8F', // Persian Green
        '#264653', // Charcoal
        '#E07A5F', // Terra Cotta
        '#81B29A', // Eton Blue
        '#F2CC8F', // Buff
    ],
    cool: [
        '#0077B6', // Blue NCS
        '#00B4D8', // Vivid Sky Blue
        '#90E0EF', // Sky Blue
        '#023E8A', // Dark Blue
        '#03045E', // Dark Blue
        '#48CAE4', // Vivid Sky Blue
        '#ADE8F4', // Light Blue
        '#CAF0F8', // Light Cyan
    ],
}

// Get a random palette from predefined ones
export function getRandomPalette(): string[] {
    const paletteNames = Object.keys(contrastPalettes) as Array<keyof typeof contrastPalettes>
    const randomName = paletteNames[Math.floor(Math.random() * paletteNames.length)]
    return shuffleArray([...contrastPalettes[randomName]])
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

// Calculate relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    if (!rgb1 || !rgb2) return 1

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

// Get text color (black or white) based on background for best contrast
export function getTextColor(backgroundColor: string): string {
    const rgb = hexToRgb(backgroundColor)
    if (!rgb) return '#000000'

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b)
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
