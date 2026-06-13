export function averageComplexity(analisis) {
    const complexity = calcularComplejidad(analisis)

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

export function calcularComplejidad(analisis) {
    const cantTokens = analisis.tokens.length
    const cantSustantivos = analisis.sustantivos.length
    const cantVerbos = analisis.verbos.length
    
    // Prevenimos una división por cero
    const diversidad = cantTokens > 0 ? (analisis.tokensUnicos / cantTokens) : 0

    let nivel
    if (cantTokens < 5) {
        nivel = "simple"
    } else if (cantTokens < 10) {
        nivel = "media"
    } else {
        nivel = "compleja"
    }

    return {
        nivel,
        tokens: cantTokens,
        tokensUnicos: analisis.tokensUnicos,
        diversidad: parseFloat(diversidad.toFixed(2)),
        sustantivos: cantSustantivos,
        verbos: cantVerbos,
        esPregunta: analisis.esPregunta,
        oraciones: analisis.oraciones
    }
}