import Joi from "joi";
import { contactsHandler } from "../models/contactsHandler.js";
import { HttpError } from "../utils/HttpError.js";

const schema = Joi.object({
  name: Joi.string()
    // .pattern(new RegExp("^[a-zA-Z0-9-_]{3,30}$"))
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  phone: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
});

const getContacts = async (req, res, next) => {
  try {
    const contacts = await contactsHandler.getContacts();>>

    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contactsHandler.getContactById(req.params.id);
    if (!contact) {
      //$ op1
      // return res.status(404).json({ message: "Not found" });
      //$ opt2
      // const error = new Error("Not found");
      // error.status = 404;
      // throw error;
      //$ opt3
      throw HttpError({ status: 404, message: "Not found" });
    }

    res.json(contact);
  } catch (error) {
    //$ opt1
    // return res.status(500).json({ message: "Server error" });
    //$ opt2
    // const { status = 500, message = "Server error" } = error;
    // return res.status(status).json({ message });
    //$ opt3
    next(error); // will looking for handler (app.use() in app.js) that have 4 arguments (first - will be the error)
  }
};

const addContact = async (req, res, next) => {
  try {
    const obj = schema.validate(req.body);

    // if (error) throw error;
    if (obj.error) {
      console.log(
        Object.getOwnPropertyNames(obj.error), // [ 'stack', 'message', '_original', 'details' ] - show all properties of object ("obj.error" in this example), even if they are not showed in console.log(obj.error)
      );
      console.log("obj:::", obj.error, { depth: null }); // showed all structure of obj.error. The console.log() in Node.js not showed last object i obj.err, just:
      //    details: [[Object]]
      // but in real there is:
      //    details: [
      //   {
      //     message: '"name" must only contain alpha-numeric characters',
      //     path: [Array],
      //     type: 'string.alphanum',
      //     context: [Object]
      //   }
      // ]
      // The "details" contain array of objects with detail description for each error of validation. If there ara several errors, they all will be in this array.

      throw HttpError({ status: 400, message: obj.error });
    }

    const newContact = await contactsHandler.addContact(req.body);
    res.status(201).json(newContact); // successfully add new entry
  } catch (error) {
    next(error);
  }
};

const editContact = async (req, res, next) => {
  const { id } = req.params;
  const updContact = req.body;

  try {
    const { error } = schema.validate(updContact);
    if (error) throw HttpError({ status: 400, message: error });

    const editedContact = await contactsHandler.editContact({
      id,
      ...updContact,
    });

    if (!editedContact) throw HttpError({ status: 404, message: "Not found" });

    res.json(editedContact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const removedContact = await contactsHandler.removeContact(req.params.id);
    if (!removedContact) throw HttpError({ status: 404, message: "Not found" });

    // res.json(removedContact);

    res.json({ message: "Delete success" });

    // if need to send 204 status:
    // res.status(204).json({ message: "Delete success" }); - doesn't make sense because 204 status means "No Content". So body will not come anyway.
    // res.status(204).send(); // it is enough for 204 status
  } catch (error) {
    next(error);
  }
};

export const contactsController = {
  getContacts,
  getContactById,
  addContact,
  editContact,
  removeContact,
};
