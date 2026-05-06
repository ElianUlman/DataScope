import {Router} from "express";

import {
    initialPage, 
    createInvite,
    getInvites,
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

import {
    getCompaniesByAdminId, 
    createCompany, 
    getCompanyData
} from "../controllers/companies.controller.js"

const routes = Router();

//GETs
routes.get("/", initialPage);

routes.get('/userdata', authentication, getUserData)
routes.get('/invites', authentication, adminAuth, getInvites)
routes.get('/companiesWithUser', authentication, getCompanyData)

routes.get('/mycompanies', authentication, getCompaniesByAdminId)

routes.get('/users', getUsers)

//PUTS
routes.put('/company', createCompany)
routes.put('/user', createUser)
routes.put('/invite', authentication, adminAuth, createInvite)

//POSTS
routes.post('/login', loginUser)

routes.post('/message', authentication, uploadMessage)

export default routes;










