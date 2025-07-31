const express = require("express");
const cors = require("cors");
// const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory empire store
let empires = [];

//post 
app.post("/geo-json-service/upload", (req, res) => {
    // console.log(req.body)
  const { empire_name, start_year, end_year, content } = req.body;

  // Basic validation
  if (!empire_name || !start_year || !end_year || !content) {
    return res.status(400).json({
      empire_id: null,
      status: "failure"
    });
  }

  const randomEmpireId = Math.floor(100000 + Math.random() * 900000); // 6-digit

  const newEmpire = {
    id: randomEmpireId,
    empire_name,
    start_year,
    end_year,
    content
  };

  empires.push(newEmpire);

  return res.status(201).json({
    empire_id: newEmpire.id,
    status: "success"
  });
});


//update 

app.put("/geo-json-service/update", (req, res) => {
  console.log(req.body)
  const { object_id, empire_name, start_year, end_year, content } = req.body;

  // Validation
  if (!object_id) {
    return res.status(400).json({
      status: "failure",
      message: "object_id is required"
    });
  }

  if (
    empire_name === null &&
    start_year === null &&
    end_year === null &&
    content === null
  ) {
    return res.status(400).json({
      status: "failure",
      message: "At least one field must be provided"
    });
  }

  // Find the empire by ID
  const empire = empires.find(e => e.id == object_id);

  if (!empire) {
    return res.status(404).json({
      status: "failure",
      message: "Record not found"
    });
  }

  // Update fields if provided
  if (empire_name !== null) empire.empire_name = empire_name;
  if (start_year !== null) empire.start_year = start_year;
  if (end_year !== null) empire.end_year = end_year;
  if (content !== null) empire.content = content;

  // Return success
  return res.json({
    status: "success",
    message: null
  });
});


//get all 
app.get("/geo-json-service/get-all-empires", (req, res) => {
  const response = empires.map(empire => ({
    object_id: empire.id,
    empire_name: empire.empire_name,
    start_year: empire.start_year,
    end_year: empire.end_year,
    content : empire.content

  }));

  res.json(response);
});


//get by id 
app.get("/geo-json-service/get-empire/:id", (req, res) => {
  const { id } = req.params;
//   console.log(id)
  const empire = empires.find(e => e.id == id);
//   console.log(empire)

  if (!empire) {
    return res.status(404).json({
      status: "failure",
      message: "Record not found"
    });
  }

  return res.status(200).json({
    "object_id": empire.id,
  "empire_name": empire.empire_name,
  "start_year": empire.start_year,
  "end_year": empire.end_year,
  "content": empire.content
  });


});


app.delete("/geo-json-service/delete/:id", (req, res) => {
  const { id } = req.params;
//   console.log(id)

  // Validate object_id
  if (!id) {
    return res.status(400).json({
      status: "failure",
      message: "object_id is required"
    });
  }

  // Find empire by id
  const index = empires.findIndex(empire => empire.id == id);
//   console.log(index)

  if (index === -1) {
    return res.status(404).json({
      status: "failure",
      message: "Record not found"
    });
  }

  // Remove empire from in-memory storage
  empires.splice(index, 1);

  return res.status(200).json({
    status: "success",
    message: "Empire deleted successfully"
  });
});



app.listen(PORT, () => {
  console.log(`🌍 Empire server running at http://localhost:${PORT}`);
});
