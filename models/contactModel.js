import { Schema, model } from "mongoose";
import validate from "mongoose-validator";
import Joi from "joi";
import { handleMongooseError } from "../utils/handleMongooseError.js";

const numberTypeList = ["home", "work", "friend"];
const birthDateRegExp = /^\d{2}-\d{2}-\d{4}$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;

const emailValidator_v1 = validate({
  validator: "isEmail", // Used ready validator for emails
  message: "Invalid email format",
});

const emailValidator_v2 = validate({
  validator: function (value) {
    // Validation with a regular expression:
    // - at least 1 domain after "@"
    // - at least 2 symbols after the last period
    const regex = emailRegExp;
    return regex.test(value);
  },
  message:
    "Invalid email format. Ensure at least one domain after @ and at least 2 characters after the last dot.",
});

//* Mongoose-schema - validate data before for save it in db
const mongooseContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      validate: emailValidator_v2, // Підключаємо валідатор
    },
    phone: {
      type: String,
      required: true,
      validate: validate({
        validator: String,
        // validator: "isNumeric", // Built-in numeric check
        arguments: [10, 15], // min and max number length
        message: "Phone number must be numeric and 10-15 characters long",
      }),
    },
    favorite: {
      type: Boolean, // boolean type of value
      default: false, // default value
    },
    number_type: {
      type: String,
      enum: numberTypeList, // array of possible values
      // enum: {
      //   values: ["home", "work", "friend"],
      //   // message: "Current value for number_type is not valid",
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
mongooseContactSchema.post("save", handleMongooseError);

// This fn will be the same for each schemas of Mongoose. Therefore you should to move this fn to isolated file (to helpers/utils)

const Contact = model("contact", mongooseContactSchema);

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

const joiSchemas = {
  addContact,
  editFavorite,
};

export { joiSchemas, Contact };
