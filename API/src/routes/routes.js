import {Router} from "express";

import {initialPage} from "../controllers/controller.js"

import {
    uploadMessage
} from "../controllers/messages.controller.js"

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

routes.get('/', initialPage)
routes.post('/', initialPage)


routes.get('/userdata', authentication, getUserData)
routes.get('/invites', authentication, adminAuth, getInvites)
routes.get('/companiesWithUser', authentication, getCompanyData)

routes.get('/mycompanies', authentication, getCompaniesByAdminId)


//PUTS
routes.put('/company', authentication, createCompany)
routes.put('/user', createUser)
routes.put('/invite', authentication, adminAuth, createInvite)

//POSTS
routes.post('/login', loginUser)

routes.post('/message', authentication, uploadMessage) //authentication is deleted for now. Later it will need one (as to link users to their prompts).

export default routes;










