# Full-Stack MERN Employee Database Application + A Complete Guide 💼

<div align="center">
<img height="150px" weidth="200px" align=center src="https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/a0ce32c9-2466-49ae-8043-78eeee7c6d51">
</div>

Welcome to a Full-Stack MERN application, designed to manage an employee database efficiently. <br>
This project develop using **MongoDB, Express.js, React, and Node.js (MERN stack), along with Vite.js**
for the frontend setup.  <img height=20px src="https://skillicons.dev/icons?i=mongo"> <img height=20px src="https://skillicons.dev/icons?i=express"> <img height=20px src="https://skillicons.dev/icons?i=nodejs">  <img height=20px src="https://skillicons.dev/icons?i=react"> <img height=20px src="https://skillicons.dev/icons?i=js"> . <br>
Scroll down for a complete guide for this project. ⬇

## Technologies Used 🛠️
🔹 **The MERN stack** is a web development framework made up of the stack of MongoDB, Express, React.js, and Node.js.<br>
🔹 **MongoDB Atlas database**: A NoSQL database for storing employee data.  
🔹 **Express.js**: A backend framework for building robust server-side applications.  
🔹 **React**: A frontend library for building interactive user interfaces.  
🔹 **Node.js**: A JavaScript runtime for executing server-side code.  
🔹 **Vite.js**: A modern build tool that provides a fast development experience for React projects.



## Client Server Architecture 🧱
#### Server Side
```javascript
// server.js
import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```



```javascript
// server/routes/record.js
import express from "express";
import db from "../db/connection.js";

import { ObjectId } from "mongoDB"; // convert the id from string to ObjectId for the _id.

// creating instance of express router, to define our routes.
// `router` will be added as a middleware and will take control of requests starting with `path /record`.
const router = express.Router();

router.get("/", async (req, res) => {  // get a list of all the records.
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/:id", async (req, res) => {  // get a single record by id
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

//Create a new record.
// the request made by 'fetch("http://localhost:5050/record")' in client
// corresponds to this route handler defined in router.post("/", ...) on server.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

router.patch("/:id", async (req, res) => {  // update a record by id.
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("records");
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});
export default router;
```




#### Client Side
```javascript
// Component Summary:
// - The component can be used to either create a new employee record or update an existing one.
// - It fetches existing record data if an `id` is provided.
// - It communicates with an API to save or update records.
// - It provides form fields for capturing employee details.

// Serves as a `form component` for creating or updating employee records.
// It provides a UI to input employee details like name, position, and level.
// It interacts with an API to fetch existing records and save new or updated records.
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RecordForm() {
  // State variables to manage form data and record status (data for the employee record)
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true); // Flag to check if it's a new record or existing
  const params = useParams();         // Stores the route parameters, specifically the id of the record.
  const navigate = useNavigate();     // A function to navigate between routes


  // useEffect to fetch an existing record when the component mounts, if an id is provided in the URL.
  useEffect(() => {

    // Fetching Record:
    // Makes a GET request to fetch the record with the given id.
    // If successful, it updates the form with the fetched record.
    // If the record doesn't exist, it navigates back to the home page.
    async function fetchData() {
      // Check if the route has an ID parameter.
      // Attempt to get the id from params and convert it to a string, or if it doesn't exist or undefined, set id to undefined.
      const id = params.id?.toString() || undefined; 
      if(!id) return;   //if id is undefined exit the fetchData function early without making fetch request.

      setIsNew(false); // Exit early if id is undefined


      // Makes a GET request to fetch the record with the given id.
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record); // Set the form state with fetched record data
    } // end of fetchData()


    fetchData();

    return;
  }, [params.id, navigate]);



  // Function to Updates the form state with new values.
  // Takes an object with new values and merges it with the current form state.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }



  // Handles form submission by either creating a new record or updating an existing one.
  // When either a POST or PATCH request is sent to the URL, fetch will either add a new record to the database or update an existing record in the database.
  async function onSubmit(e) {
    e.preventDefault();
    // Prepare Data: Copies the current form state to prepare the data for submission.
    const person = { ...form };
    try {

      let response;
      if (isNew) {
        // API Request:
        // Makes a POST request to create a new record if isNew is true.
        // Makes a PATCH request to update an existing record if isNew is false.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } 
      
      else {
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {   // Error Handling: Catches any errors that occur during the API request.
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred adding or updating a record: ', error);
    } 
    
    // Cleanup:
    // Clears the form after submission.
    // Navigates back to the home page.
    finally {
      // Clear the form and navigate back to home page
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }


  // Renders the form to capture employee information.
  // Title: Displays a title for the form.
  // Employee Info: Displays a section title and description for employee information.
  // Form Fields:
  // Name: Input field for the employee's name.
  // Position: Input field for the employee's position.
  // Level: Radio buttons to select the employee's level (Intern, Junior, Senior).
  // Submit Button: A button to save the employee record.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Employee Record</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First Last"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Developer Advocate"
                    value={form.position}
                    onChange={(e) => updateForm({ position: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Position Options</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="positionIntern"
                      name="positionOptions"
                      type="radio"
                      value="Intern"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.level === "Intern"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionIntern"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Intern
                    </label>
                    <input
                      id="positionJunior"
                      name="positionOptions"
                      type="radio"
                      value="Junior"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.level === "Junior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionJunior"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Junior
                    </label>
                    <input
                      id="positionSenior"
                      name="positionOptions"
                      type="radio"
                      value="Senior"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.level === "Senior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionSenior"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Senior
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
```










---
<br>

## Screenshots 🖼️ -
## `RecordList` Component: 🖼️
##### This is what the landing page of the record component will look like after we’ve added records:
![RecordList](https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/941cecd4-63ab-44c9-be7f-4d9988ba4dd5)

##### Edit Record:
![Edit button clicked](https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/15fa784e-ddae-4405-9b9c-e32e9e709e7c)


## `RecordForm` Component: 🖼️
##### This is what the screen that lets you add an employee will look like:
![RecordForm](https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/9c5b3817-6d52-4f9d-be82-921dab2ee50f)


## MongoDB Atlas Database: 🖼️
##### Project: `React-Projects`, Database: `employees`, collection: `records` 🛢 -
![mongodb](https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/f547c66c-dab1-4cd0-ad4c-23c0fb92161f)
















<br>

---
<br>



# A Complete Guide for MERN Stack 💼: 
## Tutorial for building a full-stack MERN application - Employee database 🛢

### How to get started with the MERN stack - 
<img height="40px" align=center src="https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/4b1dd0bc-2c2b-4ea1-a6f9-d6c5ca95384c">

- [x] Install Node.js

## Setting Up the Project 🚀

#### Directories Creation:
```bash
mkdir mern && cd mern
mkdir server && cd server
```


#### Installing Dependencies:
In the `server` directory:
```bash
npm init -y
npm install mongodb express cors
```

##### The command above installs three different packages:
- [x] mongodb — the MongoDB database driver that allows your Node.js applications to connect to the database and work with data
- [x] express — the web framework for Node.js (it will make our lives easier)
- [x] cors — a Node.js package that allows cross-origin resource sharing


#### Adding "type": "module" in package.json:
In `package.json` file:
```json
{
  "type": "module"
}
```

#### Create server
create a file called server.js with the following code:
```javascript
// mern/server/server.js
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

```



# Implementing MongoDB 📊 
**MongoDB Atlas** <img height=30px src="https://skillicons.dev/icons?i=mongo">
is a cloud-based database service that provides robust data security and reliability.
Create an account on MongoDB Atlas, deploy your first cluster, and locate your `cluster’s connection string`. <br>
Now that you have the connection string, go back to the ‘server’ directory and create a ‘config.env’ file. There,
assign the connection string to a new ATLAS_URI variable. Once done, your file should look similar to the one below.
Replace `< username >, < password >, < clusterName >, and < projectId >` with your database username, password, cluster name, and project ID.

##### mern/server/config.env:

```bash
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.<projectId>.mongodb.net/employees?retryWrites=true&w=majority
PORT=5050
```




## Connecting to MongoDBAtlas <img height="70px" align=center src="https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/d4c64fbc-0195-403a-a58c-c91cf756f989">:
Create a folder under the `server` directory named `db` and inside it, a file named `connection.js`. <br>
There we can add the following code to connect to our database.


```javascript
// connection.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("employees");

export default db;
```

---



## Setting Up Server API Endpoints 🛠️
Database done. Server done. Now, it's time for the API endpoints. <br>
Creating a routes folder and adding `record.js` in it, inside “server” directory 


#### Creating API Endpoints:
The routes/record.js file will also have the following lines of code in it.

```javascript
// mern/server/routes/record.js

import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
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

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
```


✅ That’s it for the back end. Now, we will start working on the front end.



<br>

---
<br>



## Setting Up the React Application ⚛️
using Vite, a modern way to create a React application. <img height=30px src="https://skillicons.dev/icons?i=react"> <img height=30px src="https://skillicons.dev/icons?i=vite">

#### Creating React App using Vite:
In the root directory (`mern`), run:
```bash
npm create vite@latest client --template react
cd client
npm install
```



Some additional dependencies will be used in our project. We’ll start with **Tailwind CSS**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Next, we’ll edit the content field in the tailwind.cofig.js file.
```bash
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```


In the `src/index.css` file, we need to add the Tailwind directives and delete everything else:
```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Lastly, we’ll install react-router-dom:
```bash
npm install -D react-router-dom
```

- [x] `Tailwind` is a utility-first CSS framework that allows you to add CSS styles by utilizing predefined class names. <br>
- [x] `React Router` adds client-side page routing to React!







## Setting Up React Router 🌐

#### Configuring React Router:
Inside the `client` directory, edit `App.js`:
```javascript
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RecordList />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

### 🔦 React Router -
We have set up our application page routes in the router variable and used `RouterProvider` to keep our UI in sync with the URL.
**`RouterProvider` helps with seamless transitions while switching between components.**
It will only **reload or refresh the component that needs to be changed** instead of refreshing or reloading the entire page.
Though React Router is not a necessity, it is a must if you want your app to be responsive.
<br>

<br>

---
<br>

## Creating Components ⚙️
Next, create the **components** we defined in our routes.
Create a components folder inside the src folder.
For each component we create, we will add a new .js file inside the components folder.
In this case, we will add `Navbar.jsx`, `RecordList.jsx`, and `ModifyRecord.jsx`.



#### Creating React Components:
Inside the `client/src/components` directory, create necessary components such as `Navbar.jsx`, `RecordList.jsx`, and `ModifyRecord.jsx`.

#### 🔎 A snapshot of each file would look like the following:

### Navbar.jsx 
In the `navbar.js` component, we will create a navigation bar that will link us to the required components using the following code.

```javascript
//mern/client/src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img alt="MongoDB logo" className="h-10 inline" src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"></img>
        </NavLink>

        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/create">
          Create Employee
        </NavLink>
      </nav>
    </div>
  );
}
```


### RecordList.jsx 
The following code will serve as a viewing component for our records.
It will **fetch** all the records in our database through a `GET method`.


```javascript
// mern/client/src/components/RecordList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
```



### Record.jsx 
The following code will serve as a **form** component to create or update records.
This component will either submit a create command or an update command to our server.


```javascript
// mern/client/src/components/Record.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Employee Record</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First Last"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Position
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Developer Advocate"
                    value={form.position}
                    onChange={(e) => updateForm({ position: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Position Options</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="positionIntern"
                      name="positionOptions"
                      type="radio"
                      value="Intern"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.level === "Intern"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionIntern"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Intern
                    </label>
                    <input
                      id="positionJunior"
                      name="positionOptions"
                      type="radio"
                      value="Junior"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.level === "Junior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionJunior"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Junior
                    </label>
                    <input
                      id="positionSenior"
                      name="positionOptions"
                      type="radio"
                      value="Senior"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.level === "Senior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionSenior"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Senior
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
```



Now, we add the following to the `src/App.jsx` file.
```javascript
// mern/client/src/App.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default App
```

#### App.jsx -
This is our main layout component. Our `Navbar` will always be at the top of every page and the `Outlet` will accept the children components
we defined in our routes in the `main.jsx` file earlier.


<br>

---
<br>




## Connecting Frontend to Backend 🔄
We have completed creating components, connected our React app to the back end using **fetch**, <br>
which provides cleaner and easier ways to handle `http` requests. <br>
In `Record.jsx`, we appended the following code to the onSubmit(e) block. <br>
When either a POST or PATCH request is sent to the URL, fetch will either add a new record to the database or update an existing record in the database.


```javascript
// This function will handle the submission.
async function onSubmit(e) {
  e.preventDefault();
  const person = { ...form };
  try {
    // if the id is present, we will set the URL to /record/:id, otherwise we will set the URL to /record.
    const response = await fetch(`http://localhost:5050/record${params.id ? "/"+params.id : ""}`, {
      // if the id is present, we will use the PATCH method, otherwise we will use the POST method.
      method: `${params.id ? "PATCH" : "POST"}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('A problem occurred with your fetch operation: ', error);
  } finally {
    setForm({ name: "", position: "", level: "" });
    navigate("/");
  }
}
```

We also placed the following block of code to `Record.jsx` beneath the constructor block in order to load an existing record,
if it exists.

```javascript
useEffect(() => {
  async function fetchData() {
    const id = params.id?.toString() || undefined;
    if(!id) return;
    const response = await fetch(
      `http://localhost:5050/record/${params.id.toString()}`
    );
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const record = await response.json();
    if (!record) {
      console.warn(`Record with id ${id} not found`);
      navigate("/");
      return;
    }
    setForm(record);
  }
  fetchData();
  return;
}, [params.id, navigate]);
```




Lastly, `RecordList.jsx`-
`RecordList.jsx` fetches the records from the database, so we will be using fetch's `GET` method to retrieve records from the database.
To achieve this, we added the following lines of code above the 'RecordList()' function in `RecordList.jsx`.


```javascript
// This method fetches the records from the database.
useEffect(() => {
  async function getRecords() {
    const response = await fetch(`http://localhost:5050/record/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const records = await response.json();
    setRecords(records);
  }
  getRecords();
  return;
}, [records.length]);
```

- After closing everything, to start the app, follow the steps below.
- Ensure that the server app is still running. If it’s not, start it by executing the following command in the `server directory`:
```bash
node --env-file=config.env server
```

- In a new terminal, go to the `client directory` and run the command:
```bash
npm run dev
```









<br>

---
<br>


## How To Run  🛠️
##### Create the file `mern/server/config.env` with your Atlas URI and the server port:
```
ATLAS_URI=mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net/
PORT=5050
```

##### Start server:
```
cd mern/server
npm install
npm start
```

##### Start Web server:
```
cd mern/client
npm install
npm run dev
```


<img height="450px" align=center src="https://github.com/shanibider/Full-Stack-MERN-Employee-Database-Application/assets/72359805/bc6920c2-8797-401e-94ad-11a14d19ec1b">

<br>

---
<br>


## 📫 Connect with me 😊
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shani-bider/)
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://shanibider.onrender.com/)
[![gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shanibider@gmail.com)

<footer>
<p style="float:left; width: 20%;">
Copyright © Shani Bider, 2024
</p>
</footer>
