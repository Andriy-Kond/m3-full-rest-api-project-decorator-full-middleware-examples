// * Move functions to contactsController.js

import express from "express";
import { contactsController } from "../../controllers/contactsController.js";
import { checkSchemaDecorator } from "../../middlewares/checkShemaDecorator.js";
import { contactsShema } from "../../models/contact.js";
import { isValidId } from "../../middlewares/isValidId.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getContacts);

contactsRouter.get("/:id", isValidId, contactsController.getContactById);

// * local middlewares "checkSchemaDecorator" for each request:
contactsRouter.post(
  "/",
  checkSchemaDecorator(contactsShema),
  contactsController.addContact,
);

// for update all fields
contactsRouter.put(
  "/:id",
  isValidId,
  checkSchemaDecorator(contactsShema),
  contactsController.editContact,
);

// for update only one field (for example "favorite")
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  checkSchemaDecorator(contactsShema),
  contactsController.editContact,
);

contactsRouter.delete("/:id", contactsController.removeContact);
