import axiosClient from "../../axiosClient.js";

export const userLogin = async (email, password) => {
    try {
        const response = await axiosClient.post(
            "/login",
            {
                "email": email,
                "password": password
            }
        );

        return response

    } catch (error) {
        throw error

    }
};

export const userSignup = async (name, email, password) => {
    try {
        const response = await axiosClient.put(
            "/user",
            {
                "name": name,
                "email": email,
                "password": password

            }
        );

        return response

    } catch (error) {
        throw error

    }
};

export const getUserData = async (token) => {
    try {
        const response = await axiosClient.get("/userdata", {
            headers: {
                Authorization: token
            }
        })

        return response

    } catch (error) {

        throw error
    }
}

export const patchUserProfilePic = async (token, image) => {
    try {
        const response = await axiosClient.patch(
            "/user/pfp",
            image,
            {
                headers: {
                    Authorization: token
                }
            }
        );
        return response
    } catch (error) {
        throw error
    }
}

export const patchUser = async (token, data) => {
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

export const fullSignUp = async (companyName, companyTier, username, email, password) => {
    try {
        const response = await axiosClient.put(
            "/createCompany",
            {
                "companyName": companyName,
                "companyTier": companyTier,
                "username": username,
                "email": email,
                "password": password
            }
        )

        return true

    } catch (error) {
        throw error
    }
}
