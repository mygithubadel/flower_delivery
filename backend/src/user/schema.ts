import Joi from "joi";

const JoiPhoneValidator = Joi.string().pattern(/^(\+40|0)(7\d{8}|2\d{8}|3\d{8})$/).messages({
    'string.pattern.base': 'Must be a valid Romanian phone number starting with +40 or 0'
});
const JoiEmailValidator = Joi.string().email().required();
const JoiPasswordValidator = Joi.string().min(6).required();
const JoiUsernameValidator = Joi.string().required().min(5).max(100);

export const registerSchema = Joi.object({
    email: JoiEmailValidator,
    username: JoiUsernameValidator,
    password: JoiPasswordValidator,
    phone: JoiPhoneValidator
});

export const loginSchema = Joi.object({
    username: JoiUsernameValidator,
    password: JoiPasswordValidator
});