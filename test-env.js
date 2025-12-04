// Quick test script to check if environment variable is loaded
console.log('Environment check:');
console.log('NEXT_PUBLIC_AI_API_KEY exists:', !!process.env.NEXT_PUBLIC_AI_API_KEY);
console.log('NEXT_PUBLIC_AI_API_KEY length:', process.env.NEXT_PUBLIC_AI_API_KEY?.length || 0);
console.log('NEXT_PUBLIC_AI_API_KEY starts with sk-:', process.env.NEXT_PUBLIC_AI_API_KEY?.startsWith('sk-'));

// Don't log the actual key for security
if (process.env.NEXT_PUBLIC_AI_API_KEY) {
    const key = process.env.NEXT_PUBLIC_AI_API_KEY;
    console.log('Key format: sk-...', key.slice(-4));
} else {
    console.log('❌ API key is not loaded!');
}
