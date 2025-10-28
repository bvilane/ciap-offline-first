/**
 * Authentication Validators
 */

const Joi = require('joi');

/**
 * User registration schema
 */
const userSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
    }),

  email: Joi.string()
    .email()
    .optional(),

  role: Joi.string()
    .valid('user', 'admin')
    .optional(),
});

/**
 * Login schema
 */
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const validateUser = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateUser,
  validateLogin,
};
