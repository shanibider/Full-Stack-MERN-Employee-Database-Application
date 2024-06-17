import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb"; // Convert the id from string to ObjectId for the _id.

// Router for handling record-related routes is created here. 
const router = express.Router();

// Backend defines API endpoints at /record for CRUD operations (GET, GET by id, POST, PATCH, DELETE):

// Get a list of all the records.
router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("records"); // Get 'records' collection from db.
    const results = await collection.find({}).toArray(); // Fetch all records and convert to an array
    res.status(200).send(results); // Send the results with a 200 OK status
  } catch (err) {
    console.error("Failed to fetch records:", err); 
    res.status(500).send("Error fetching records"); 
  }
});

// Get a single record by id
router.get("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }; // Create a query object to find the record by its _id
    const collection = await db.collection("records"); // Get 'records' collection 
    const result = await collection.findOne(query); // Find one record matching the query

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
      name: req.body.name, // Set the name field from the request body
      position: req.body.position, // Set the position field from the request body
      level: req.body.level, // Set the level field from the request body
    };
    const collection = await db.collection("records"); // Get 'records' collection 
    const result = await collection.insertOne(newDocument); // Insert the new document into the collection
   res.status(201).send(result); // 201 Created
  } catch (err) {
    console.error("Failed to create record:", err);
    res.status(500).send("Error creating record");
  }
});



// Update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    // Converts the id parameter from the URL into a MongoDB ObjectId.
    const query = { _id: new ObjectId(req.params.id) }; // Used to find the record by its _id
   // Creates an update object using the $set operator.
   // The fields name, position, and level are set to the values provided in the request body (req.body).
    const updates = {
      $set: {
        name: req.body.name,  
        position: req.body.position, 
        level: req.body.level, 
      },
    };
    const collection = await db.collection("records"); // Retrieves records collection.
    // Update the document matching the query
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) { // Checks the matchedCount property of the result to determine if any documents were matched by the query.
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
    const result = await collection.deleteOne(query); // Delete the document matching the query

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

export default router; // Export the router
