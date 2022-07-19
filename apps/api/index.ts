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
app.get("/list", async (req, res) => {
  const list = await prisma.list.findMany();
  res.json(list);
});

app.listen(3001, () => {
  console.log("api at port 3001");
});
