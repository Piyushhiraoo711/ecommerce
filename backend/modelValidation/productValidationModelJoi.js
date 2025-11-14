import Joi from "joi";

export const productSchemaValidate = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Product Name is required",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name cannot exceed 100 characters",
  }),
  description: Joi.string().min(0).max(500).optional(),
  price: Joi.number().positive().precision(2).required().messages({
    "number.empty": "Price is required",
  }),
  category: Joi.string().min(2).max(50).required(),
  brand: Joi.string().min(2).max(50).optional(),
  stock: Joi.number().integer().min(0).positive().required().messages({
    "number.empty": "Stock is required",
  }),
});
