import { HttpError } from "../utils/HttpError.js";

export const checkSchemaDecorator = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) next(HttpError({ status: 400, message: error }));

    next();
  };
};
