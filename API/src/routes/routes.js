import {Router} from "express";

//old
import {
    uploadMessage
    
} from "../controllers/controller.js"

import {
    adminAuth,
    authentication, 
    onlyIntParam
} from "../middleware/middleware.js"


import { 
    getUserData,
    loginUser,
    createUser
} from "../controllers/user.controller.js";

import {
    getCompaniesByAdminId, 
    createCompany, 
    getCompanyData
} from "../controllers/companies.controller.js"

import {
    createInvite, 
    getInvites
} from "../controllers/invites.controller.js"

const routes = Router();

//GETs

routes.get('/userdata', authentication, getUserData)
routes.get('/invites', authentication, adminAuth, getInvites)
routes.get('/companiesWithUser', authentication, getCompanyData)

routes.get('/mycompanies', authentication, getCompaniesByAdminId)


//PUTS
routes.put('/company', authentication, createCompany)
routes.put('/user', createUser)
routes.put('/invite', authentication, adminAuth, createInvite) //gotta solve issue where you can invite same person multiple times

//POSTS
routes.post('/login', loginUser)

routes.post('/message', authentication, uploadMessage)

export default routes;










