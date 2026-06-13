import 'dotenv/config'
import nlp from 'compromise'
import natural from 'natural'
import { pipeline, env } from '@xenova/transformers'

// OPTIMIZACIONES EXTREMAS DE MEMORIA:
// 1. Forzamos a que use un solo hilo de procesamiento
env.backends.onnx.wasm.numThreads = 1;
// 2. Desactivamos el proxy de workers para no duplicar memoria
env.backends.onnx.wasm.proxy = false;
// 3. Desactivar variables locales extras si no hacen falta
env.allowLocalModels = true;
env.useBrowserCache = false;

import { encoding_for_model, get_encoding } from "tiktoken";

import { GoogleGenAI } from '@google/genai';
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let clasificador = null
let traductor = null

let textoOriginal = ""
let texto
let analisis = {
    tokens: [],
    tokensUnicos: 0,
    sustantivos: [],
    verbos: [],
    esPregunta: false,
    oraciones: 0
}

export async function initClasificador() {
    console.log("Cargando modelos locales de IA...")

    // 1. Modelo de traducción (Confirmado que funciona)
    if (!traductor) {
        traductor = await pipeline('translation', 'Xenova/opus-mt-es-en', { quantized: true })
    }

    // 2. Modelo de clasificación (Usamos un clásico que no falla en el hub de Xenova)
    if (!clasificador) {
        clasificador = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-large', { quantized: true })
    }

    console.log("Modelos listos")
}

export function setPrompt(prompt) {
    textoOriginal = prompt
    texto = prompt
}

export async function preProcesarPrompt() {
    console.log("Traduciendo texto a inglés para NLP y Clasificación...")

    // TRADUCCIÓN OBLIGATORIA
    const resultadoTrad = await traductor(textoOriginal)
    texto = resultadoTrad[0].translation_text

    console.log("Texto traducido:", texto)

    // A partir de aquí, 'texto' está en inglés. 
    // Compromise extraerá sustantivos y verbos perfectamente.
    getWords()

    // Generamos los tokens aquí para que la métrica de 'complejidad' no falle
    const tokenizer = new natural.WordTokenizer()
    analisis.tokens = tokenizer.tokenize(texto)
    analisis.tokensUnicos = new Set(analisis.tokens).size
}

export function getWords() {
    const doc = nlp(texto)

    analisis.sustantivos = doc.nouns().out('array')
    analisis.verbos = doc.verbs().out('array')
    analisis.esPregunta = doc.questions().length > 0
    analisis.oraciones = doc.sentences().length

    console.log("-----PALABRAS-----")
    console.log("Sustantivos:", analisis.sustantivos)
    console.log("Verbos:", analisis.verbos)
    console.log("Es pregunta:", analisis.esPregunta)
    console.log("Oraciones:", analisis.oraciones)
}

export async function tokenize(prompt, AI) {


    if (AI === "chatgpt") {
        return encoding_for_model("gpt-4").encode(prompt).length
    } else if (AI === "claude") {
        //para contar bien las tokens de claude, se necesita una key (que NO es gratuita)
        return get_encoding("cl100k_base").encode(prompt).length

    } else if (AI === "gemini") {
        const result = await gemini.models.countTokens({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })
        return result.totalTokens;

    } else {
        return tokenizer.tokenize(prompt).length
    }

    /** old
        const tokenizer = new natural.WordTokenizer()
        analisis.tokens = tokenizer.tokenize(texto)
        analisis.tokensUnicos = new Set(analisis.tokens).size

        console.log("-----TOKENS-----")
        console.log("Tokens:", analisis.tokens)
        console.log("Cantidad:", analisis.tokens.length)
        console.log("Únicos:", analisis.tokensUnicos)

        return analisis.tokens.length
     
     */

}

//bandaid function
export function averageComplexity() {
    const complexity = calcularComplejidad()

    let averageComplexity = 0
    let atributeCounter = 0
    for (let atribute of Object.values(complexity)) {
        if (typeof (atribute) === typeof (1) || typeof (atribute) === typeof (1.1)) {
            averageComplexity += atribute;
            atributeCounter++;
        }
    }
    averageComplexity = (Math.floor((averageComplexity / atributeCounter) * 100)) / 100
    return averageComplexity
}

export function calcularComplejidad() {
    const cantTokens = analisis.tokens.length
    const cantSustantivos = analisis.sustantivos.length
    const cantVerbos = analisis.verbos.length
    const diversidad = analisis.tokensUnicos / cantTokens

    let nivel
    if (cantTokens < 5) {
        nivel = "simple"
    } else if (cantTokens < 10) {
        nivel = "media"
    } else {
        nivel = "compleja"
    }

    const resultado = {
        nivel,
        tokens: cantTokens,
        tokensUnicos: analisis.tokensUnicos,
        diversidad: parseFloat(diversidad.toFixed(2)),
        sustantivos: cantSustantivos,
        verbos: cantVerbos,
        esPregunta: analisis.esPregunta,
        oraciones: analisis.oraciones
    }

    console.log("-----COMPLEJIDAD-----")
    console.log(resultado)

    return resultado
}

export async function clasificate() {
    if (!clasificador) {
        console.log("Clasificador no inicializado")
        return null
    }

    // Usamos espacios en lugar de guiones bajos para que el modelo entienda el lenguaje natural
    const categorias = [
        "development and coding",
        "data and math",
        "text generation and editing",
        "research and learning",
        "brainstorming and creativity",
        "general and support"
    ]

    // Añadimos un hypothesis_template para darle más contexto direccional al clasificador
    const resultado = await clasificador(texto, categorias, {
        hypothesis_template: "This message is related to {}.",
        multi_label: true
    })

    // Volvemos a colocar los guiones bajos para no romper tu base de datos
    const clasificacion = {
        categoria: resultado.labels[0].replace(/ /g, '_'),
        confianza: parseFloat(resultado.scores[0].toFixed(2)),
        top3: resultado.labels.slice(0, 3).map((label, i) => ({
            categoria: label.replace(/ /g, '_'),
            confianza: parseFloat(resultado.scores[i].toFixed(2))
        }))
    }

    console.log("-----CLASIFICACION-----")
    console.log(clasificacion)

    return clasificacion
}