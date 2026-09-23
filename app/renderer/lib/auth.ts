import {betterAuth} from "better-auth"
import Database from "better-sqlite3"


const auth = betterAuth({
    database: new Database()
})