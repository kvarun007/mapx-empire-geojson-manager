const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let empires = [];

// POST - Upload new empire
app.post("/geo-json-service/upload", (req, res) => {
  const { empire_name, start_year, end_year, content } = req.body;

  if (
    !empire_name ||
    !start_year?.year ||
    !start_year?.era ||
    !end_year?.year ||
    !end_year?.era ||
    !content
  ) {
    return res.status(400).json({
      empire_id: null,
      status: "failure",
      message: "Invalid or missing fields",
    });
  }

  const randomEmpireId = Math.floor(100000 + Math.random() * 900000);

  const newEmpire = {
    id: randomEmpireId,
    empire_name,
    start_year,
    end_year,
    content,
  };

  // console.log(newEmpire)
  empires.push(newEmpire);

  return res.status(201).json({
    empire_id: newEmpire.id,
    status: "success",
  });
});

// PUT - Update existing empire
app.put("/geo-json-service/update", (req, res) => {
  const { object_id, empire_name, start_year, end_year, content } = req.body;

  if (!object_id) {
    return res.status(400).json({
      status: "failure",
      message: "object_id is required",
    });
  }

  const empire = empires.find((e) => e.id == object_id);

  if (!empire) {
    return res.status(404).json({
      status: "failure",
      message: "Record not found",
    });
  }

  // Optional updates
  if (empire_name !== null && empire_name !== undefined)
    empire.empire_name = empire_name;

  if (
    start_year &&
    typeof start_year.year === "number" &&
    ["BCE", "CE"].includes(start_year.era)
  ) {
    empire.start_year = start_year;
  }

  if (
    end_year &&
    typeof end_year.year === "number" &&
    ["BCE", "CE"].includes(end_year.era)
  ) {
    empire.end_year = end_year;
  }

  if (content !== null && content !== undefined) empire.content = content;

  return res.json({
    status: "success",
    message: "Empire updated",
  });
});

// GET - All empires
app.get("/geo-json-service/get-all-empires", (req, res) => {
  const response = empires.map((empire) => ({
    object_id: empire.id,
    empire_name: empire.empire_name,
    start_year: empire.start_year,
    end_year: empire.end_year,
    content: empire.content,
  }));
  
  res.json(response);
});

// GET - Single empire by ID
app.get("/geo-json-service/get-empire/:id", (req, res) => {
  const { id } = req.params;
  const empire = empires.find((e) => e.id == id);

  if (!empire) {
    return res.status(404).json({
      status: "failure",
      message: "Record not found",
    });
  }

  return res.status(200).json({
    object_id: empire.id,
    empire_name: empire.empire_name,
    start_year: empire.start_year,
    end_year: empire.end_year,
    content: empire.content,
  });
});

// DELETE - Delete empire by ID
app.delete("/geo-json-service/delete/:id", (req, res) => {
  const { id } = req.params;

  const index = empires.findIndex((empire) => empire.id == id);

  if (index === -1) {
    return res.status(404).json({
      status: "failure",
      message: "Record not found",
    });
  }

  empires.splice(index, 1);

  return res.status(200).json({
    status: "success",
    message: "Empire deleted successfully",
  });
});

app.listen(PORT, () => {
  console.log(`🌍 Empire server running at http://localhost:${PORT}`);
});
