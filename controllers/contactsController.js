// import { Contact } from "../models/Contact.js";
import { Contact } from "../models/contactModel.js";
import { HttpError } from "../utils/HttpError.js";
import { tryCatchDecorator } from "../utils/tryCatchDecorator.js";

const getContacts = async (req, res, next) => {
  //^ Method .find() always returns array.
  const contacts = await Contact.find(); // Finds all items in collection
  const contacts2 = await Contact.find({ name: "Andrii8" }); // Will search for an exact match: will find "Andrii8", but not "Andrii" (will return empty array).
  const contacts3 = await Contact.find({}, "name email"); // Returns fields "_id", "name" and "email" only.
  const contacts4 = await Contact.find({}, "-name -email"); // Returns all fields except "name" and "email"

  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  // const contact = await Contact.getContactById(req.params.id);

  //^ Method .findOne() returns first match or null
  const contact = await Contact.findOne({ _id: req.params.id }); // return first match where _id === req.params.id. Used for search by any field except id.

  const contact2 = await Contact.findById(req.params.id); // Used for search by field _id

  // When _id have right format, but that _id not in db, the .findById() returns "null", and you'll get status 404, because check "if (!contact)..." will return "false".
  // When _id format will be wrong you'll get this error (because "contact" will be "true":
  //$ Cast to ObjectId failed for value \"676ed63e31157cbbd0a69a105\" (type string) at path \"_id\" for model \"contact\"
  // and, accordingly, status 500 instead 404.
  // Therefore you should use additional middleware isValidId

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
  //^ Method .create()
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const editFullContact = async (req, res, next) => {
  const { id } = req.params;

  // # Move shema validation to routes
  // const { error } = Contact.contactsShema.validate(req.body);
  // if (error) throw HttpError({ status: 400, message: error });

  //^ Method .findByIdAndUpdate(id, obj, {new: true}): first argument must be id, second - updated object, third - for return updated obj (by default it returns old obj)
  const editedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!editedContact) throw HttpError({ status: 404, message: "Not found" });

  res.json(editedContact);
};

const editFavorite = async (req, res, next) => {
  const { id } = req.params;

  // Method .findByIdAndUpdate() validating only those fields that it receives. Other fields it not touching.
  const editedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!editedContact) throw HttpError({ status: 404, message: "Not found" });

  res.json(editedContact);
};

//^ For delete Mongoose uses two method (they work the same): .findByIdAndDelete() (ongoing method) or .findByIdAndRemove() (old method)
// These methods deleting obj from db and return this obj. If this object not exist they return "null"
const removeContact = async (req, res, next) => {
  const removedContact = await Contact.findByIdAndDelete(req.params.id);
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
  editFullContact: tryCatchDecorator(editFullContact),
  editFavorite: tryCatchDecorator(editFavorite),
  removeContact: tryCatchDecorator(removeContact),
};
