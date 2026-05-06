import {Router} from "express";

import {
    initialPage, 
    createCompany,
    createInvite,
    getInvites,
    getCompanyData,
    getAdminsCompanies,
    uploadMessage
    
} from "../controllers/controller.js"

import {
    adminAuth,
    authentication, 
    onlyCompanyAuth, 
    onlyIntParam
} from "../middleware/middleware.js"


import { 
    getUsers, 
    getUserData,
    loginUser,
    createUser
} from "../controllers/user.controller.js";

const routes = Router();

//GETs
routes.get("/", initialPage);

routes.get('/userdata', authentication, getUserData)
routes.get('/invites', authentication, adminAuth, getInvites)
routes.get('/companiesWithUser', authentication, getCompanyData)

routes.get('/mycompanies', authentication, getAdminsCompanies)

routes.get('/users', getUsers)

//PUTS
routes.put('/createCompany', createCompany)
routes.put('/createUser', createUser)
routes.put('/createInvite', authentication, adminAuth, createInvite)

//POSTS
routes.post('/login', loginUser)

routes.post('/message', authentication, uploadMessage)

export default routes;










