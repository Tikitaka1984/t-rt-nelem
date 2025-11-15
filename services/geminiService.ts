import { GoogleGenAI, Type } from "@google/genai";
import { Article, EventDetail, TimelineEvent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const articleResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A fogalom neve, pontosan úgy, ahogy a felhasználó beírta.",
    },
    definition: {
      type: Type.STRING,
      description: "3-6 mondatos, tankönyvi pontosságú definíció. A fontos történelmi szakkifejezéseket jelöld dőlt formázással, egyetlen csillaggal körbevéve, pl. *rendiség*.",
    },
    relatedConcepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: {
            type: Type.STRING,
            description: "A kapcsolódó fogalom neve.",
          },
          explanation: {
            type: Type.STRING,
            description: "A kapcsolódó fogalom egy mondatos, precíz magyarázata.",
          },
        },
        required: ["term", "explanation"],
      },
      description: "4-6 kapcsolódó, érettségi szintű fogalom.",
    },
  },
  required: ["title", "definition", "relatedConcepts"],
};

const timelineResponseSchema = {
    type: Type.ARRAY,
    description: "A témához kapcsolódó legfontosabb történelmi események listája, időrendi sorrendben.",
    items: {
        type: Type.OBJECT,
        properties: {
            date: {
                type: Type.STRING,
                description: "Az esemény pontos dátuma vagy éve (pl. '1848. március 15.', 'Kr. e. 44', '1914-1918')."
            },
            title: {
                type: Type.STRING,
                description: "Az esemény rövid, velős címe."
            },
            description: {
                type: Type.STRING,
                description: "Az esemény jelentőségének rövid, 1-2 mondatos leírása."
            }
        },
        required: ["date", "title", "description"]
    }
};

const eventDetailResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Az esemény címe, ahogy a kérésben szerepelt."
    },
    explanation: {
      type: Type.OBJECT,
      properties: {
        antecedents: { type: Type.STRING, description: "Az esemény részletes, érettségi szintű előzményei (minimum 3 mondat)." },
        main_events: { type: Type.STRING, description: "A fő történések részletes, érettségi szintű leírása (minimum 3 mondat)." },
        significance: { type: Type.STRING, description: "Az esemény történelmi jelentősége (minimum 2 mondat)." },
        consequences: { type: Type.STRING, description: "Az esemény következményei (minimum 2 mondat)." }
      },
      required: ["antecedents", "main_events", "significance", "consequences"]
    },
    relatedConcepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "A kapcsolódó fogalom neve." },
          explanation: { type: Type.STRING, description: "A kapcsolódó fogalom egy mondatos, precíz magyarázata." }
        },
        required: ["term", "explanation"]
      },
      description: "3-6, az eseményhez kapcsolódó, érettségi szintű fogalom."
    },
    relatedPersons: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "A kapcsolódó személy neve." },
          description: { type: Type.STRING, description: "A személy szerepének rövid, 1-2 mondatos leírása az eseménnyel kapcsolatban." }
        },
        required: ["name", "description"]
      },
      description: "Az eseményhez kapcsolódó 2-4 legfontosabb személy."
    }
  },
  required: ["title", "explanation", "relatedConcepts", "relatedPersons"]
};

export const fetchConcept = async (term: string): Promise<Omit<Article, 'id'>> => {
  const systemInstruction = `
    Te egy mesterséges intelligencia vagy, amely egy végtelenül bővíthető fogalomtárat ('Történelmi Tudástár+') hoz létre magyar 12. évfolyamos diákok számára a történelemérettségi felkészüléshez. 
    Minden válaszodnak pontosnak, közérthetőnek és szakmailag helyesnek kell lennie a középszintű és emelt szintű történelemérettségi követelményei szerint (NAT 2020).
    A válaszod stílusa legyen formális, objektív és tényszerű. Szigorúan tartsd be a megadott JSON sémát és formázási utasításokat. A teljes válasz magyar nyelven legyen.
  `;

  const prompt = `Készíts egy szócikket a következő fogalomról: "${term}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: articleResponseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (!parsedData.title || !parsedData.definition || !Array.isArray(parsedData.relatedConcepts)) {
        throw new Error("Invalid data structure received from API.");
    }

    return parsedData as Omit<Article, 'id'>;

  } catch (error) {
    console.error("Error fetching or parsing concept from Gemini API:", error);
    if (error instanceof SyntaxError) {
      throw new Error("A kapott válasz formátuma hibás volt.");
    }
    throw new Error("Nem sikerült lekérni az adatokat a Gemini API-tól.");
  }
};

export const fetchTimelineEvents = async (topic: string): Promise<TimelineEvent[]> => {
    const systemInstruction = `
    Te egy történész mesterséges intelligencia vagy, aki magyar 12. évfolyamos diákok számára készít idővonalakat.
    A feladatod, hogy a megadott témáról készíts egy 8-12 kulcsfontosságú eseményből álló listát, szigorúan időrendi sorrendben.
    Minden eseménynek tartalmaznia kell egy dátumot, egy rövid címet és egy 1-2 mondatos leírást a jelentőségéről.
    A válaszodat a megadott JSON séma szerint add vissza. A teljes válasz magyar nyelven legyen.
  `;

  const prompt = `Készíts egy idővonalat a következő történelmi témáról: "${topic}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: timelineResponseSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedData)) {
        throw new Error("Invalid data structure received from API, expected an array.");
    }

    return parsedData as TimelineEvent[];

  } catch (error) {
    console.error("Error fetching or parsing timeline from Gemini API:", error);
    if (error instanceof SyntaxError) {
      throw new Error("A kapott válasz formátuma hibás volt.");
    }
    throw new Error("Nem sikerült lekérni az idővonal adatokat a Gemini API-tól.");
  }
};

export const fetchEventDetail = async (eventName: string): Promise<Omit<EventDetail, 'id'>> => {
  const systemInstruction = `
    Te egy történész mesterséges intelligencia vagy, aki magyar 12. évfolyamos diákok számára készít részletes elemzéseket történelmi eseményekről.
    A válaszod legyen tankönyvi stílusú, formális és feleljen meg a történelem érettségi követelményeinek.
    Strukturáld a választ a megadott JSON séma szerint. A válasz nyelve magyar.
  `;

  const prompt = `Készíts egy részletes, érettségi szintű elemzést a következő történelmi eseményről: "${eventName}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a more powerful model for detailed analysis
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: eventDetailResponseSchema,
        temperature: 0.4,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    if (!parsedData.title || !parsedData.explanation || !parsedData.relatedConcepts || !parsedData.relatedPersons) {
        throw new Error("Invalid data structure for event detail received from API.");
    }

    return parsedData as Omit<EventDetail, 'id'>;

  } catch (error) {
    console.error("Error fetching or parsing event detail from Gemini API:", error);
    if (error instanceof SyntaxError) {
      throw new Error("A kapott válasz formátuma hibás volt.");
    }
    throw new Error("Nem sikerült lekérni az esemény részleteit a Gemini API-tól.");
  }
};

export const fetchShortDefinition = async (term: string): Promise<string> => {
  const systemInstruction = `
    Te egy történész mesterséges intelligencia vagy. A feladatod, hogy a megadott fogalomról egy rendkívül tömör, 1-2 mondatos, érettségi szintű definíciót adj. 
    A válaszod legyen pontos, lényegre törő és magyar nyelvű. Csak magát a definíciót add vissza, mindenféle bevezető vagy extra formázás nélkül.
  `;
  const prompt = `Add meg a következő fogalom tömör, 1-2 mondatos definícióját: "${term}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching short definition from Gemini API:", error);
    throw new Error("Nem sikerült létrehozni a rövid definíciót.");
  }
};