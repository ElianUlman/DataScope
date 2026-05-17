
export const validateFields = (requiredFields, object) => {
    
    for (const field of requiredFields) {
        if (!object[field]) {
            throw new Error(`${field} is required`);
        }
    }

    return true
}

export const blockFields = (blockedFields, object) => {
    
    for (const field of blockedFields) {
        if (object[field]) {
            throw new Error(`${field} cannot be included in this request`);
        }
    }

    return true
}
