// import { Contact } from "../models/Contact.js";
import { Contact, contactsShema } from "../models/contact.js";
import { HttpError } from "../utils/HttpError.js";
import { tryCatchDecorator } from "../utils/tryCatchDecorator.js";

const getContacts = async (req, res, next) => {
  const contacts = await Contact.find();

  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  const contact = await Contact.getContactById(req.params.id);
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

const addContact = async (req, res, next) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const editContact = async (req, res, next) => {
  const { id } = req.params;

  // # remove shema validation to routes
  // const { error } = contactsShema.validate(req.body);
  // if (error) throw HttpError({ status: 400, message: error });

  const editedContact = await Contact.editContact({
    id,
    ...req.body,
  });

  if (!editedContact) throw HttpError({ status: 404, message: "Not found" });

  res.json(editedContact);
};

const removeContact = async (req, res, next) => {
  const removedContact = await Contact.removeContact(req.params.id);
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
