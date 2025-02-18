import { Schema, model } from "mongoose";

import Joi from "joi";
import { handleMongooseError } from "../utils/handleMongooseError.js";
import validator from "validator";

const { isEmail, isLength, isNumeric } = validator;

const numberTypeList = ["home", "work", "friend"];
const birthDateRegExp = /^\d{2}-\d{2}-\d{4}$/;

// Regular expression:
// - at least 1 domain after "@"
// - at least 2 symbols after the last period
const emailRegExp = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

const customEmailValidator = value => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};

// const emailValidator_v1 = validate({
//   validator: "isEmail", // Buit-in validator of mongoose-validator for emails
//   message: "Invalid email format",
// });

// const emailValidator_v2 = validate({
//   validator: function (value) {
//     const regex = emailRegExp;
//     return regex.test(value);
//   },
//   message:
//     "Invalid email format. Ensure at least one domain after @ and at least 2 characters after the last dot.",
// });

//* Mongoose-schema - validate data before for save it in db
const mongooseContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name i required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must be not exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Name is required"],
      validate: {
        // validator: value => isEmail(value), // Built-in in validator.js check for email
        validator: customEmailValidator,
        message:
          "Invalid email format. Ensure at least one domain after @ and at least 2 characters after the last dot",
      },
    },
    phone: {
      type: String,
      required: true,
      // Validation of old package "mongoose-validator":
      // validate: validate({
      //   validator: String,
      //   // validator: "isNumeric", // Built-in numeric check
      //   arguments: [10, 15], // min and max length of number
      //   message: "Phone number must be numeric and 10-15 characters long",
      // }),

      // Validation of new package "validator.js"
      validate: {
        validator: value => isLength(value, { min: 10, max: 15 }),
        message: "Phone must be 10-15 characters long",
      },
    },
    favorite: {
      type: Boolean, // boolean type of value
      default: false, // default value
    },
    number_type: {
      type: Schema.Types.Mixed, // Allows string or numbers types,
      enum: numberTypeList, // array of possible values
      // or:
      // enum: {
      //   values: numberTypeList,
      //   // message: "Current value for number_type is not valid", // in error case
      //   required: true,
      // },
      required: true,
    },
    birth_date: {
      type: String,
      match: birthDateRegExp, // 25-08-1978
    },
  },
  { versionKey: false, timestamps: true },
);

const mongooseContactSchema_v2 = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9-_]+$/, // equivalent to Joi.alphanum()
  },
  email: {
    type: String,
    required: true,
    // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // equivalent to Joi.email()
    match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, // equivalent to Joi.email() + require 2 symbols after last dot.
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/, // equivalent to Joi.email() + require 2 segments after "@"
  },
  phone: {
    type: Schema.Types.Mixed, // Allows string or numbers types
    required: true,
  },
});

// ! Middleware for errors of mongoose schema:
// Mongoose throws errors without status. If status not presented, will be error.status = 500, because in case of error, tryCatchDecorator() will catch it and invokes next(error). The next with error argument will invoke app.use((err, req, res, next) in app.js and set status = 500. But error of body validation is not 500 status (Internal Server Error), but must be 400 status (Bad request). Therefore you should set status=400 in additional middleware.
// The next middleware will works when will be error from any of Mongoose-schema methods (.find(), .create(), etc).
// This fn will be the same for each schemas of Mongoose. Therefore you should to move this fn to isolated file (to helpers/utils)
mongooseContactSchema.post("save", handleMongooseError);
// "save" — це подія (hook), яка в цьому прикладі спрацьовує ПІСЛЯ того, як виконується .save() на екземплярі моделі.
// Mongoose має хуки (middleware) двох типів:
// pre – виконується перед певною дією (наприклад, перед .save()).
// post – виконується після певної дії (наприклад, після .save()).
// Варіанті хуків:
// .pre("save", callback) — виконується ПЕРЕД збереженням. Вимагає виклику next(), щоб продовжити виконання.
// .post("save", callback) — виконується ПІСЛЯ збереження. next() не потрібен, бо збереження вже відбулося.
// .post("remove", callback) — виконується ПІСЛЯ видалення.
// .post("updateOne", callback) — виконується ПІСЛЯ оновлення.

export const Contact = model("contact", mongooseContactSchema); // Creating mongoose model (schema)

//* Joi-schema - validate data that comes from frontend
// Joi and Mongoose schemas works together. Joi-schema verifying incoming data, Mongoose-schema verifying data that you want to save in database.
// For example incoming data of date can be in format "YYYY-MM-DD", but in database format should be in format "DD-MM-YYYY". So after incoming data you should to formatting it in right format before note it in database.

// Schema for set all fields (add new contact or edit contact)
const addContact = Joi.object({
  name: Joi.string()
    // .pattern(new RegExp("^[a-zA-Z0-9-_]{3,30}$"))
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  // email: Joi.string()
  //   .email({
  //     minDomainSegments: 2, // After last dot must be minimum 2 symbols
  //   })
  //   .required(),
  email: Joi.string().pattern(emailRegExp),
  phone: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  favorite: Joi.boolean(),
  number_type: Joi.string()
    .valid(...numberTypeList)
    .required(),
  birth_date: Joi.string().pattern(birthDateRegExp).required(),
});

// Schema for set the "favorite" field only
const editFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

export const joiContactSchemas = {
  addContact,
  editFavorite,
};
