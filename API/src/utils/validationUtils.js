
export const validateFields = (requiredFields, object) => {
    
    for (const field of requiredFields) {
        if (!object[field]) {
            throw new Error(`${field} is required`);
        }
    }

    return true
}