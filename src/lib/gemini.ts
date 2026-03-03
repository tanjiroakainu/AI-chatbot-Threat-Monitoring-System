// Fallback model IDs if List Models fails (order: try first available)
const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-pro',
];

async function getAvailableModel(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { models?: Array<{ name: string; supportedGenerationMethods?: string[] }> };
    const generateContent = (data.models ?? []).find((m) =>
      m.supportedGenerationMethods?.includes('generateContent')
    );
    if (!generateContent?.name) return null;
    return generateContent.name.replace('models/', '');
  } catch {
    return null;
  }
}

export async function sendToGemini(userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error(
      'Gemini API key is not configured. Locally: set VITE_GEMINI_API_KEY in .env. On Vercel: add VITE_GEMINI_API_KEY in Project Settings → Environment Variables, then redeploy.'
    );
  }

  const listModel = await getAvailableModel(apiKey);
  const modelsToTry = listModel ? [listModel, ...FALLBACK_MODELS.filter((m) => m !== listModel)] : FALLBACK_MODELS;
  let lastError: string | null = null;

  for (const modelId of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      if (res.status === 404) {
        lastError = err;
        continue;
      }
      throw new Error(res.status === 429 ? 'Rate limit exceeded. Try again shortly.' : err || `Gemini API error: ${res.status}`);
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ?? 'No response from AI.';
  }

  throw new Error(lastError ?? 'No supported Gemini model found. Check your API key and quota.');
}
