import {Router} from "express";



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
    createUser,
    updateUserData
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

import { getStatsByUser, getUserAvg } from "../controllers/statistic.controller.js";

const routes = Router();

//GETs




routes.get('/userdata', authentication, getUserData)
routes.get('/invites', authentication, adminAuth, getInvites)
routes.get('/companiesWithUser', authentication, getCompanyData)
routes.get('/stats', authentication, getStatsByUser)
routes.get('/statsAvg', authentication, getUserAvg)

routes.get('/mycompanies', authentication, getCompaniesByAdminId)


//PUTS
routes.put('/company', authentication, createCompany)
routes.put('/user', createUser)
routes.put('/invite', authentication, adminAuth, createInvite)

//PATCHS
routes.patch('/user', authentication, updateUserData)

//POSTS
routes.post('/login', loginUser)

routes.post('/message', authentication, uploadMessage) //authentication is deleted for now. Later it will need one (as to link users to their prompts).

export default routes;










