import express from "express";
import { contactsHandler } from "../../models/contactsHandler.js";
import { HttpError } from "../../utils/HttpError.js";

export const contactsRouter = express.Router();

contactsRouter.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsHandler.getContacts();

    res.json(contacts);
  } catch (error) {
    // return res.status(500).json({ message: "Server error" });
    const { status = 500, message = "Server error" } = error;
    return res.status(status).json({ message });
  }
});

contactsRouter.get("/:id", async (req, res, next) => {
  try {
    const contact = await contactsHandler.getContactById(req.params.id);
    if (!contact) {
      // return res.status(404).json({ message: "Not found" });
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }

    res.json(contact);
  } catch (error) {
    // return res.status(500).json({ message: "Server error" });
    const { status = 500, message = "Server error" } = error;
    return res.status(status).json({ message });
  }
});

contactsRouter.post("/", async (req, res, next) => {
  try {
    const newContact = await contactsHandler.addContact(req.body);

    res.json(newContact);
  } catch (error) {
    // return res.status(500).json({ message: "Server error" });
    const { status = 500, message = "Server error" } = error;
    return res.status(status).json({ message });
  }
});

contactsRouter.put("/:id", async (req, res, next) => {
  try {
    const editedContact = await contactsHandler.editContact(req.body);

    res.json(editedContact);
  } catch (error) {
    // return res.status(500).json({ message: "Server error" });
    const { status = 500, message = "Server error" } = error;
    return res.status(status).json({ message });
  }
});

contactsRouter.delete("/:id", async (req, res, next) => {
  try {
    const removedContact = await contactsHandler.removeContact(req.params.id);

    res.json(removedContact);
  } catch (error) {
    // return res.status(500).json({ message: "Server error" });
    const { status = 500, message = "Server error" } = error;
    return res.status(status).json({ message });
  }
});
