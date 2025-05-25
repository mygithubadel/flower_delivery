import Joi from "joi";

export const orderCreateSchema = Joi.object({
    status: Joi.string().valid('pending', 'delivered', 'canceled').required(),
    flower_details: Joi.object().required(),
    quantity: Joi.number().integer().min(1).required(),
    address: Joi.string().min(3).required()
});

export const orderUpdateSchema = Joi.object({
    status: Joi.string().valid('pending', 'delivered', 'canceled'),
    flower_details: Joi.object(),
    quantity: Joi.number().integer().min(1),
    address: Joi.string().min(3)
}).min(1);
