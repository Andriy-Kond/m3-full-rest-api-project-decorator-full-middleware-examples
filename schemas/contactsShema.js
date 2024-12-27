// import Joi from "joi";

// export const contactsShema = Joi.object({
//   name: Joi.string()
//     // .pattern(new RegExp("^[a-zA-Z0-9-_]{3,30}$"))
//     .alphanum()
//     .min(3)
//     .max(30)
//     .required(),
//   email: Joi.string()
//     .email({
//       minDomainSegments: 2,
//     })
//     .required(),
//   phone: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
//   number_type: Joi.string(),
// });
