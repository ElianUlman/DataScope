import 'dotenv/config'
import nlp from 'compromise'
import natural from 'natural'
import { encoding_for_model, get_encoding } from "tiktoken";
import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function getWords(texto) {
    const doc = nlp(texto)
    const tokenizer = new natural.WordTokenizer()
    const tokens = tokenizer.tokenize(texto)

    const analisis = {
        sustantivos: doc.nouns().out('array'),
        verbos: doc.verbs().out('array'),
        esPregunta: doc.questions().length > 0,
        oraciones: doc.sentences().length,
        tokens: tokens,
        tokensUnicos: new Set(tokens).size
    }

    console.log("-----PALABRAS Y TOKENS-----")
    console.log("Sustantivos:", analisis.sustantivos.length)
    console.log("Verbos:", analisis.verbos.length)
    console.log("Tokens Totales:", analisis.tokens.length)

    return analisis
}

export async function tokenize(prompt, AI) {
    if (AI === "chatgpt") {
        return encoding_for_model("gpt-4").encode(prompt).length
    } else if (AI === "claude") {
        return get_encoding("cl100k_base").encode(prompt).length
    } else if (AI === "gemini") {
        const result = await gemini.models.countTokens({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })
        return result.totalTokens;
    } else {
        const tokenizer = new natural.WordTokenizer()
        return tokenizer.tokenize(prompt).length
    }
}