// * Move functions to contactsController.js

import express from "express";
import { contactsController } from "../../controllers/contactsController.js";
import { checkSchemaDecorator } from "../../middlewares/checkShemaDecorator.js";
import { joiSchemas } from "../../models/contactModel.js";
import { isValidId } from "../../middlewares/isValidId.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getContacts);

contactsRouter.get("/:id", isValidId, contactsController.getContactById);

// * local middlewares "checkSchemaDecorator" for each request:
contactsRouter.post(
  "/",
  checkSchemaDecorator(joiSchemas.addContact),
  contactsController.addContact,
);

// Route for update all fields
contactsRouter.put(
  "/:id",
  isValidId,
  checkSchemaDecorator(joiSchemas.addContact),
  contactsController.editFullContact,
);

// Route for update only one field (for example "favorite")
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  checkSchemaDecorator(joiSchemas.editFavorite),
  contactsController.editFavorite,
);

contactsRouter.delete("/:id", contactsController.removeContact);
