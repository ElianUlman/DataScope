import axiosClient from "../../axiosClient.js";

export const getUserData = async (token, data) => {
    try {
        const response = await axiosClient.patch("/user", data,
            {
                headers: {
                    Authorization: token
                }
            })
        return response

    } catch (error) {

        throw error
    }
}