import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import path from 'path';

const PORT = process.env.PORT || 5050;
const app = express();

// Modify server.js to Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')));
} else {
  app.use(cors());
  // middleware to parse incoming requests with JSON payloads
app.use(express.json());

// middleware to handle requests starting with /record
// 2nd argument is the records.js file
//"localhost:5050/record" will be handled by records.js
app.use("/record", records);
}


if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
  });
}

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
