import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send("tjena");
});

app.listen(8000);
