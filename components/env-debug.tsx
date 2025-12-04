"use client"

// Debug component - Add this temporarily to your page to check env loading
export function EnvDebug() {
    const hasKey = !!process.env.NEXT_PUBLIC_AI_API_KEY
    const keyLength = process.env.NEXT_PUBLIC_AI_API_KEY?.length || 0
    const keyStart = process.env.NEXT_PUBLIC_AI_API_KEY?.substring(0, 7) || 'none'

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            background: 'black',
            color: 'white',
            padding: '10px',
            fontSize: '12px',
            borderRadius: '5px',
            zIndex: 9999
        }}>
            <div>API Key Status:</div>
            <div>Exists: {hasKey ? '✅' : '❌'}</div>
            <div>Length: {keyLength}</div>
            <div>Starts: {keyStart}</div>
        </div>
    )
}
