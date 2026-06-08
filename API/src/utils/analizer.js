import nlp from 'compromise'
import natural from 'natural'
import { pipeline } from '@xenova/transformers'


import { encoding_for_model, get_encoding } from "tiktoken"; //chatgpt token counter

import { GoogleGenAI } from '@google/genai';// for counting geminis tokens
const gemini = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6IL-TNZTZM7op8hJZJPDbK061mJTy27vBCnhuAIu5sByw' }); //aparentemente esto es un secret :/


let clasificador = null

//btw chatgpt me dijo que es mejor no hacer variables globales por si le llegan muchos
//request a la API (porque entonces se podria llegar a sobrescribir el valor)
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
    console.log("Cargando modelo de IA...")
    clasificador = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli')
    console.log("Modelo listo")
}

export function setPrompt(prompt) {
    texto = prompt
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
        
    }else{
        return tokenizer.tokenize(prompt).length
    }

    //datascope26@gmail.com datascope1234


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

    const categorias = [
        "technical_programming_question",
        "creative_writing",
        "data_analysis",
        "translation",
        "general_question",
        "summarization",
        "email_drafting",
        "document_editing",
        "research",
        "brainstorming",
        "math_and_calculations",
        "customer_support",
        "legal_or_compliance_question",
        "human_resources",
        "presentation_or_report_creation"
    ]

    const resultado = await clasificador(texto, categorias)

    const clasificacion = {
        categoria: resultado.labels[0],
        confianza: parseFloat(resultado.scores[0].toFixed(2)),
        top3: resultado.labels.slice(0, 3).map((label, i) => ({
            categoria: label,
            confianza: parseFloat(resultado.scores[i].toFixed(2))
        }))
    }

    console.log("-----CLASIFICACION-----")
    console.log(clasificacion)

    return clasificacion
}