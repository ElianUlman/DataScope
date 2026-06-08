// routes.js

import {Router} from "express";

import {
    AIsPorcentageByCompany,
    uploadMessage,
    getActivityVolume,
    getPlatformAdoption,
    getHourlyDistribution,
    getAvgQueryComplexity,
    getInteractionRate
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
import { func4tests } from "../controllers/controller.js";

const routes = Router();

//GETs
routes.get('/', func4tests)

routes.get('/userdata', authentication, getUserData)
routes.get('/invites', authentication, adminAuth, getInvites)
routes.get('/companiesWithUser', authentication, getCompanyData)
routes.get('/stats', authentication, getStatsByUser)
routes.get('/statsAvg', authentication, getUserAvg)
routes.get('/mycompanies', authentication, getCompaniesByAdminId)

routes.get('/dashboard/activityVolume', authentication, adminAuth, getActivityVolume)
routes.get('/dashboard/platformAdoption', authentication, adminAuth, getPlatformAdoption)
routes.get('/dashboard/hourlyDistribution', authentication, adminAuth, getHourlyDistribution)
routes.get('/dashboard/avgComplexity', authentication, adminAuth, getAvgQueryComplexity)
routes.get('/dashboard/interactionRate', authentication, adminAuth, getInteractionRate)

routes.put('/company', authentication, createCompany)
routes.put('/user', createUser)
routes.put('/invite', authentication, adminAuth, createInvite)

routes.patch('/user', authentication, updateUserData)

routes.post('/login', loginUser)
routes.post('/message', authentication, uploadMessage)

export default routes;