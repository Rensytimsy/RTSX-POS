import {string, email, object, number} from "zod"


export const storeSignUpSchema = object({
    email: email({ error: "email is required!"}),
    storename: string({ error: "store name is required!"}).min(4),
    phonenumber: string({ error: "Phone number is required!"}).min(10).max(13),
    password: string({error: "password is required!"}),
    companySize: number({ error: "provide a company size"}),
})




// Zod not related types

export type DeviceOsSystem = {
    manufacturer: string,
    model: string,
    version: string,
    serial: string,
    uuid: string,
    sku: string,
    virtual: boolean
}