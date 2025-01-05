const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =
  "mongodb+srv://CoffeeMuster:1IS4Q7IAGFuvybwp@cluster0.s0sni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("equisportsDB");
    const equipmentCollection = db.collection("equipment");
    const usersCollection = db.collection("users");

    // Equipment Routes
    app.get("/items", (req, res) => {
      const { category } = req.query;
      if (category) {
        const filteredItems = allItems.filter(
          (item) => item.category === category
        );
        res.json(filteredItems);
      } else {
        res.json(allItems);
      }
    });

    // 6
    app.get("/equipment", async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 6; // Default limit to 6 if not specified
        const equipment = await equipmentCollection
          .find()
          .limit(limit)
          .toArray();
        res.send(equipment);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        res.status(500).send({ error: "Failed to fetch equipment" });
      }
    });

    // Get all equipment
    app.get("/equipment", async (req, res) => {
      try {
        const equipment = await equipmentCollection.find().toArray();
        res.send(equipment);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        res.status(500).send({ error: "Failed to fetch equipment" });
      }
    });

    // Get equipment by ID
    app.get("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const equipment = await equipmentCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!equipment) {
          res.status(404).send({ error: "Equipment not found" });
        } else {
          res.send(equipment);
        }
      } catch (error) {
        console.error("Error fetching equipment by ID:", error);
        res.status(500).send({ error: "Failed to fetch equipment by ID" });
      }
    });

    // Add new equipment
    app.post("/equipment", async (req, res) => {
      const newEquipment = req.body;
      try {
        const result = await equipmentCollection.insertOne(newEquipment);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding equipment:", error);
        res.status(500).send({ error: "Failed to add equipment" });
      }
    });

    // Update equipment
    app.put("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const updatedEquipment = req.body;
      try {
        const result = await equipmentCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedEquipment }
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating equipment:", error);
        res.status(500).send({ error: "Failed to update equipment" });
      }
    });

    // Delete equipment
    app.delete("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await equipmentCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        console.error("Error deleting equipment:", error);
        res.status(500).send({ error: "Failed to delete equipment" });
      }
    });

    // User Routes

    // Get all users
    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.send(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ error: "Failed to fetch users" });
      }
    });

    // Add a new user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      try {
        const result = await usersCollection.insertOne(newUser);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send({ error: "Failed to add user" });
      }
    });

    // Update user sign-in time
    app.patch("/users", async (req, res) => {
      try {
        const { email, lastSignInTime } = req.body;

        if (!email || !lastSignInTime) {
          return res
            .status(400)
            .json({ error: "Missing email or lastSignInTime" });
        }

        const filter = { email };
        const updateDoc = { $set: { lastSignInTime } };
        const result = await usersCollection.updateOne(filter, updateDoc);

        if (result.matchedCount > 0) {
          res
            .status(200)
            .json({ message: "User information updated successfully." });
        } else {
          res.status(404).json({ error: "User not found." });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/equipment", async (req, res) => {
      try {
        const equipment = await equipmentCollection.find({}).toArray();
        res.status(200).json(equipment);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        res.status(500).json({ error: "Failed to fetch equipment" });
      }
    });

    // equipment
    app.get("/equipment", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const equipment = await equipmentCollection.find(query).toArray();
      res.json(equipment);
    });
    // Delete equipment
    app.delete("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.deleteOne(query);
      res.json(result);
    });
    // update equipment
    app.put("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedData,
      };
      const result = await equipmentCollection.updateOne(query, updateDoc);
      res.json(result);
    });
    app.post("/equipment", async (req, res) => {
      try {
        const equipment = req.body;
        const result = await equipmentCollection.insertOne(equipment);
        res.send(result);
      } catch (error) {
        console.error("Error inserting equipment:", error);
        res.status(500).send({ error: "Failed to add equipment" });
      }
    });

    // Delete user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await usersCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ error: "Failed to delete user" });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catchs(console.dir);

// Base Route
app.get("/", (req, res) => {
  res.send("EquiSports API is running...");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
