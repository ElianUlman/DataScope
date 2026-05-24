export const initialPage = async (req, res) => {
    console.log(req.body);
    console.log(req.headers.authorization)
    console.log("hasta aca me interesa la wea")

    res.send("funciono");
};
