import { prisma } from "database";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/listitems", async (req, res) => {
  const listItems = await prisma.listItem.findMany();
  res.json(listItems);
});

app.listen(3000, () => {
  console.log("api at port 3000");
});
