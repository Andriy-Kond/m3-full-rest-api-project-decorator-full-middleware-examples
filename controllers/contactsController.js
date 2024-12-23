import { contactsHandler } from "../models/contactsHandler.js";
import { HttpError } from "../utils/HttpError.js";
import { tryCatchDecorator } from "../utils/tryCatchDecorator.js";
import { contactsShema } from "../schemas/contactsShema.js";

const getContacts = async (req, res, next) => {
  const contacts = await contactsHandler.getContacts();

  res.json(contacts);
};

const getContactById = async (req, res, next) => {
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
};

const addContact_v1 = async (req, res, next) => {
  const obj = contactsShema.validate(req.body);

  // if (error) throw error;
  if (obj.error) {
    // console.log(
    //   Object.getOwnPropertyNames(obj.error), // [ 'stack', 'message', '_original', 'details' ] - show all properties of object ("obj.error" in this example), even if they are not showed in console.log(obj.error)
    // );

    // console.log("obj:::", obj.error, { depth: null }); // showed all structure of obj.error. The console.log() in Node.js not showed last object i obj.err, just:
    // //    details: [[Object]]
    // // but in real there is:
    // //    details: [
    // //   {
    // //     message: '"name" must only contain alpha-numeric characters',
    // //     path: [Array],
    // //     type: 'string.alphanum',
    // //     context: [Object]
    // //   }
    // // ]
    // // The "details" contain array of objects with detail description for each error of validation. If there ara several errors, they all will be in this array.

    throw HttpError({ status: 400, message: obj.error });
  }

  const newContact = await contactsHandler.addContact(req.body);
  res.status(201).json(newContact); // successfully add new entry
};

const editContact_v1 = async (req, res, next) => {
  const { id } = req.params;
  const updContact = req.body;

  const { error } = contactsShema.validate(updContact);
  if (error) throw HttpError({ status: 400, message: error });

  const editedContact = await contactsHandler.editContact({
    id,
    ...updContact,
  });

  if (!editedContact) throw HttpError({ status: 404, message: "Not found" });

  res.json(editedContact);
};

const addContact = async (req, res, next) => {
  // # remove shema validation to routes
  // const { error } = contactsShema.validate(req.body);
  // if (error) throw HttpError({ status: 400, message: error });

  const newContact = await contactsHandler.addContact(req.body);
  res.status(201).json(newContact);
};

const editContact = async (req, res, next) => {
  const { id } = req.params;

  // # remove shema validation to routes
  // const { error } = contactsShema.validate(req.body);
  // if (error) throw HttpError({ status: 400, message: error });

  const editedContact = await contactsHandler.editContact({
    id,
    ...req.body,
  });

  if (!editedContact) throw HttpError({ status: 404, message: "Not found" });

  res.json(editedContact);
};

const removeContact = async (req, res, next) => {
  const removedContact = await contactsHandler.removeContact(req.params.id);
  if (!removedContact) throw HttpError({ status: 404, message: "Not found" });

  // res.json(removedContact);

  res.json({ message: "Delete success" });

  // if need to send 204 status:
  // res.status(204).json({ message: "Delete success" }); - doesn't make sense because 204 status means "No Content". So body will not come anyway.
  // res.status(204).send(); // it is enough for 204 status
};

export const contactsController = {
  getContacts: tryCatchDecorator(getContacts),
  getContactById: tryCatchDecorator(getContactById),
  addContact: tryCatchDecorator(addContact),
  editContact: tryCatchDecorator(editContact),
  removeContact: tryCatchDecorator(removeContact),
};
