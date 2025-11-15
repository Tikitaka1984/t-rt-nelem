import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateEssay(topic: string, level: string, style: string, mode: string): Promise<string> {
  const model = 'gemini-2.5-pro'; // Use a powerful model for nuanced essay writing

  const prompt = `
Készíts történelmi érettségi esszét a következő téma alapján:

Téma: ${topic}
Szint: ${level}
Stílus: ${style}
Mód: ${mode}

Követelmények:

1. Ha "vázlat" mód:
- Rövid, 4–8 pontból álló struktúra
- időrenddel
- kulcsfogalmakkal
- ok-okozati vázlattal

2. Ha "teljes" mód:
- Bevezetés (téma kijelölése, időrend, problémafelvetés)
- Tárgyalás (3–4 logikus egység, ok-okozat, összefüggések, következtetések)
- Befejezés (összegzés + értékelés)
- kövesse az ${level} szintű érettségi pontozást

3. Ha "forrás" mód:
- Forrás rövid ismertetése
- Fő állítások
- Kapcsolódás történelmi folyamathoz
- Értelmezési lehetőségek
- Vizsgaszintű elemzés

Mindig a magyar NAT2020 és az OH érettségi követelményei szerint dolgozz. A válasz legyen jól strukturált, tiszta és formázás nélküli szöveg.
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.6,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating essay from Gemini API:", error);
    throw new Error("Nem sikerült létrehozni az esszét.");
  }
}
