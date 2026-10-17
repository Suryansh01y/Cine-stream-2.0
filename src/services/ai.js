const GEMINI_MODEL = "gemini-3.6-flash";

export async function getMoodMovieTitle(mood) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key") {
    throw new Error(
      "Gemini key is missing. Add VITE_GEMINI_API_KEY to .env, or use normal movie search."
    );
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const prompt = [
    "Suggest ONE movie based on this mood.",
    `User mood: ${mood}`,
    "Return ONLY the movie title as plain text.",
    "Do not add quotes, explanations, years, bullets, or extra text."
  ].join("\n");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 30
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}). ${body}`);
  }

  const data = await response.json();
  const title =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!title) {
    throw new Error("AI did not return a movie title.");
  }

  return title.replace(/^["']|["']$/g, "").trim();
}
