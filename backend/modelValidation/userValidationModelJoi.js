import Joi from "joi";

const addressSchema = Joi.object({
  street: Joi.string().min(3).max(100),
  city: Joi.string().min(2).max(50),
  state: Joi.string().min(2).max(50),
  zipCode: Joi.string()
    .length(6)
    .pattern(/^[1-9][0-9]{5}$/)
    .messages({
      "string.length": "PIN code must be 6 digits long.",
      "string.pattern":
        "PIN code must not start with 0 and contain only digits.",
      "any.required": "PIN code is required.",
    }),
  country: Joi.string().default("India"),
});

export const userSchemaValidate = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "First Name is required",
    "string.min": "First name must be at least 3 characters",
    "string.max": "First name cannot exceed 30 characters",
  }),
  lastName: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 3 characters",
    "string.max": "Last name cannot exceed 30 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 chars long and include uppercase, lowercase, number, and special character.",
    }),

  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": `Phone number must have 10 digits`,
    }),

  address: addressSchema,
  role: Joi.string()
    .valid("user", "seller", "admin")
    .default("user")
    .required()
    .messages({
      "string.empty": "Please select your role",
    }),
});
