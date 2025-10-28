/**
 * Input Validators
 * Uses Joi for schema validation
 * Prevents invalid data from entering the system
 */

const Joi = require('joi');

/**
 * Content creation validation schema
 */
const contentSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required',
    }),

  description: Joi.string()
    .max(1000)
    .allow('')
    .optional(),

  content_type: Joi.string()
    .valid('application/pdf', 'text/html', 'image/jpeg', 'image/png')
    .optional(),

  tags: Joi.string()
    .max(500)
    .allow('')
    .optional(),
});

/**
 * Content update validation schema
 */
const contentUpdateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .optional(),

  description: Joi.string()
    .max(1000)
    .allow('')
    .optional(),

  tags: Joi.string()
    .max(500)
    .allow('')
    .optional(),
}).min(1); // At least one field must be provided

/**
 * Validate content creation data
 */
const validateContent = (data) => {
  return contentSchema.validate(data, { abortEarly: false });
};

/**
 * Validate content update data
 */
const validateContentUpdate = (data) => {
  return contentUpdateSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateContent,
  validateContentUpdate,
};