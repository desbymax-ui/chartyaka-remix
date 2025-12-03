"use client"

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
    return (
        <div className="relative">
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
                className="w-12 h-12 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                style={{ backgroundColor: color }}
            />
        </div>
    )
}
