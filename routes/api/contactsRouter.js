// * Move functions to contactsController.js

import express from "express";
import { contactsController } from "../../controllers/contactsController.js";
import { checkErrorJoiSchemaDecorator } from "../../middlewares/checkErrorJoiSchemaDecorator.js";
import { joiContactSchemas } from "../../models/contactModel.js";
import { isValidId } from "../../middlewares/isValidId.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getContacts);

contactsRouter.get("/:id", isValidId, contactsController.getContactById);

// * local middlewares "checkErrorJoiSchemaDecorator" for each request:
contactsRouter.post(
  "/",
  checkErrorJoiSchemaDecorator(joiContactSchemas.addContact),
  contactsController.addContact,
);

// Route for update all fields
contactsRouter.put(
  "/:id",
  isValidId,
  checkErrorJoiSchemaDecorator(joiContactSchemas.addContact),
  contactsController.editFullContact,
);

// Route for update only one field (for example "favorite")
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  checkErrorJoiSchemaDecorator(joiContactSchemas.editFavorite),
  contactsController.editFavorite,
);

contactsRouter.delete("/:id", isValidId, contactsController.removeContact);
