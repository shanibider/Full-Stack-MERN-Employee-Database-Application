import express from "express";
import cors from "cors";
import path from 'path';
// 'router' imported and used as 'records', i could name it anything. 
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware to handle CORS and JSON payloads
app.use(cors());
app.use(express.json());

// Middleware to handle API requests starting with /record
// Mounts the records router on the /record path, so any request to /record will be handled by the routes defined in record.js.
// The /record endpoints are not part of the browser URL seen by the user; they are backend routes used by the frontend to interact with the server.
app.use("/record", records); 

/* I could name it like this to make it more clear:
import myRouter from './routes/record.js';
app.use('/record', myRouter); // Use the myRouter for routes starting with /record. */

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve(); // Resolve the current directory name
  app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

    // Catch-all handler for any requests that don't match an API route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html')); // Send the index.html file for any unmatched routes
  });
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
