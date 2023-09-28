import Joi from "joi"

const registerUserValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().max(100).required(),
    name : Joi.string().max(100).required()
})

const userLoginValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().max(100).required()
})

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().max(100).optional(),
    name : Joi.string().max(100).optional()
})

export{
    registerUserValidation,
    userLoginValidation,
    getUserValidation,
    updateUserValidation
}