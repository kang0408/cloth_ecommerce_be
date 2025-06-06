import Joi from "joi";

const baseJoi = Joi.defaults((schema) =>
  schema.options({
    messages: {
      "string.empty": "This empty field is required.",
      "string.base": "This field must be a string.",
      "number.base": "This field must be a number.",
      "number.min": "This field must be a number.",
      "any.required": "This field is required.",
      "object.unknown": "Invalid field."
    },
    stripUnknown: false
  })
);

export default baseJoi;
