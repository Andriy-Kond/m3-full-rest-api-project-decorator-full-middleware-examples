// * Move functions to contactsController.js

import express from "express";
import { contactsController } from "../../controllers/contactsController.js";
import { checkSchemaDecorator } from "../../middlewares/checkShemaDecorator.js";
import { contactsShema } from "../../models/contact.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getContacts);

contactsRouter.get("/:id", contactsController.getContactById);

// * local middlewares "checkSchemaDecorator" for each request:
contactsRouter.post(
  "/",
  checkSchemaDecorator(contactsShema),
  contactsController.addContact,
);

contactsRouter.put(
  "/:id",
  checkSchemaDecorator(contactsShema),
  contactsController.editContact,
);

contactsRouter.delete("/:id", contactsController.removeContact);
