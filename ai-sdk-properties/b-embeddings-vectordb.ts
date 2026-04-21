import dotenv from 'dotenv';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embedMany, embed, cosineSimilarity } from "ai";

// $ pnpm dlx tsx ai-sdk-properties/b-embeddings-vectordb.ts
dotenv.config();

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, // O directamente el string de la llave si querés testear rápido
});

// ! @deprecated — Use embeddingModel instead
const webModel = googleProvider.textEmbeddingModel("gemini-embedding-2-preview");

const values = ["Dog", "Cat", "Car", "Bike"]

async function main() {
  console.log("🧬 Generando embeddings en la nube...");

  try {
    const { embeddings } = await embedMany({
      model: webModel,
      values,
    });

    const dimension = embeddings[0].length;
    console.log(`✅ Dimensión del vector: ${dimension}`);
    //console.log("Ejemplo del primer vector (primeros 5 dims):", embeddings[0].slice(0, 5));
    console.dir(embeddings, { depth: null });

    // Simulando una base de datos vectorial simple en memoria
    const vectorDB = embeddings.map((embedding, index) => ({
      value: values[index],
      embedding,
    }));
    console.log("✅ Vectores generados y almacenados en la base de datos vectorial:");
    console.dir(vectorDB, { depth: null });

    const searchTerm = await embed({
      model: webModel,
      value: "Canine" // Feline, Pedal, Tire
    })

    // ? Compare two vectors using cosine similarity
    const entries = vectorDB.map(entry => ({
      value: entry.value,
      similarity: cosineSimilarity(searchTerm.embedding, entry.embedding)
    }));

    // Sort entries by similarity in descending order
    const sortedEntries = entries.sort((a, b) => b.similarity - a.similarity);

    console.log("✅ Similitud coseno calculada para cada vector ordenada:");

    console.dir(sortedEntries, { depth: null });
    /* [{ value: 'Dog', similarity: 0.8037924811544208 },
    { value: 'Cat', similarity: 0.67903512390116 },
    { value: 'Car', similarity: 0.6212310910161332 },
    { value: 'Bike', similarity: 0.6010511777515343 }] */


  } catch (error) {
    console.error("❌ Error en la nube:", error);
  }
}

main();
