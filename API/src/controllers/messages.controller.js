import {pool} from "../db.js";
import bcrypt from "bcrypt";
import {hashRounds, tokenCompanyPassword, tokenWholePassword} from "../config.js"
import jwt from "jsonwebtoken";