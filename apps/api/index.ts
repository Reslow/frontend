import { prisma } from "database";
import express from "express";

const app = express();

app.use(express.json());

app.get("/listItems", async (req, res) => {
  const listItems = await prisma.listItem.findMany();
  res.json(listItems);
});

app.listen(3000, () => {
  console.log("api at port 3000");
});
