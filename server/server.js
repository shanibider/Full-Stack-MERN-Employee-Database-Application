import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import path from 'path';

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware to handle CORS and JSON payloads
app.use(cors());
app.use(express.json());

// Middleware to handle API requests starting with /record
app.use("/record", records);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
