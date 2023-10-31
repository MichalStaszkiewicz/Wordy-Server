import { bool } from "joi"
import { JwtPayload } from "../socket/socket";



export interface IValidateToken {
    isValid: boolean, verifiedToken: JwtPayload,

}