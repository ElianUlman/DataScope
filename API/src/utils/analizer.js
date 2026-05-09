import nlp from 'compromise'
import natural from 'natural'
import { pipeline } from '@xenova/transformers'

let clasificador = null
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

export function setPrompt(prompt){
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

export function tokenize() {
    const tokenizer = new natural.WordTokenizer()
    analisis.tokens = tokenizer.tokenize(texto)
    analisis.tokensUnicos = new Set(analisis.tokens).size

    console.log("-----TOKENS-----")
    console.log("Tokens:", analisis.tokens)
    console.log("Cantidad:", analisis.tokens.length)
    console.log("Únicos:", analisis.tokensUnicos)

    return analisis.tokens.length
}

export function averageComplexity(){ //bandaid function
    const complexity = calcularComplejidad()

    let averageComplexity=0
    let atributeCounter=0
    for(let atribute of Object.values(complexity)){
        if(typeof(atribute) === typeof(1) || typeof(atribute) === typeof(1.1)){
            averageComplexity+=atribute;
            atributeCounter++;
        }
    }
    averageComplexity=(Math.floor((averageComplexity/atributeCounter)*100))/100
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
        "technical programming question",
        "creative writing",
        "data analysis",
        "translation",
        "general question"
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