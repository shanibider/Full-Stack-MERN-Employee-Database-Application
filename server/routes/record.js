import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb"; // Convert the id from string to ObjectId for the _id.

const router = express.Router();

// Get a list of all the records.
router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Failed to fetch records:", err);
    res.status(500).send("Error fetching records");
  }
});

// Get a single record by id
router.get("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("records");
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Record not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Failed to fetch record:", err);
    res.status(500).send("Error fetching record");
  }
});

// Create a new record.
router.post("/", async (req, res) => {
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const collection = await db.collection("records");
    const result = await collection.insertOne(newDocument);
    res.status(201).send(result); // 201 Created
  } catch (err) {
    console.error("Failed to create record:", err);
    res.status(500).send("Error creating record");
  }
});

// Update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const collection = await db.collection("records");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).send("Record not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Failed to update record:", err);
    res.status(500).send("Error updating record");
  }
});

// Delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("records");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      res.status(404).send("Record not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Failed to delete record:", err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
