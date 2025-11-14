import Joi from 'joi';

export const orderSchemaValidate = Joi.object({
  user: Joi.string(),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          "string.empty": "Product ID is required",
        }),
        quantity: Joi.number().integer().min(1).max(10).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Minimum quantity is 1",
          "number.max": "Maximum quantity is 10",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one product is required",
    }),

  totalAmount: Joi.number().min(0).messages({
    "number.base": "Total amount must be a number",
    "number.empty": "Total amount is required",
  }),

  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .default("pending"),

  paymentMethod: Joi.string()
    .valid("COD", "Credit Card", "UPI", "PayPal")
    .default("COD"),

  paymentStatus: Joi.string()
    .valid("unpaid", "paid", "refunded")
    .default("unpaid"),
});


