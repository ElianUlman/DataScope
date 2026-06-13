import { pipeline, env } from '@xenova/transformers'

// OPTIMIZACIONES EXTREMAS DE MEMORIA:
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.proxy = false;
env.allowLocalModels = true;
env.useBrowserCache = false;

let clasificador = null
let traductor = null

export async function initClasificador() {
    console.log("Cargando modelos locales de IA...")

    if (!traductor) {
        traductor = await pipeline('translation', 'Xenova/opus-mt-es-en', { quantized: true })
    }

    if (!clasificador) {
        clasificador = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-large', { quantized: true })
    }

    console.log("Modelos listos")
}

export async function translateText(textoOriginal) {
    const resultadoTrad = await traductor(textoOriginal)
    return resultadoTrad[0].translation_text
}

export async function clasificate(textoTraducido) {
    if (!clasificador) {
        console.log("Clasificador no inicializado")
        return null
    }

    const categorias = [
        "development and coding", "data and math", "text generation and editing",
        "research and learning", "brainstorming and creativity", "general and support"
    ]

    const resultado = await clasificador(textoTraducido, categorias, {
        hypothesis_template: "This message is related to {}.",
        multi_label: true
    })

    return {
        categoria: resultado.labels[0].replace(/ /g, '_'),
        confianza: parseFloat(resultado.scores[0].toFixed(2)),
        top3: resultado.labels.slice(0, 3).map((label, i) => ({
            categoria: label.replace(/ /g, '_'),
            confianza: parseFloat(resultado.scores[i].toFixed(2))
        }))
    }
}