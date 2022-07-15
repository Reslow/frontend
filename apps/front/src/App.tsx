import type { ListItem, List } from "@prisma/client";
import { useEffect, useState } from "react";
import Item from "./components/Item";

import "./App.css";

function App() {
  const [data, setData] = useState<ListItem[]>([]);
  const [list, setList] = useState<List>();

  async function getData() {
    let response = await fetch("http://localhost:3000/listitems");
    let data = await response.json();
    setData(data);
  }

  async function getListData() {
    let response = await fetch("http://localhost:3000/list");
    let data = await response.json();

    setList(data[0]);
  }

  useEffect(() => {
    getData();
    getListData();
  }, []);

  return (
    <div className="App">
      <h1> Front end ads </h1>
      <section>
        <p>collected from: {list && list.title}</p>
      </section>
      <div>{list?.updatedAt.toString().split("T")[0]}</div>

      <section className="container">
        {data.map((item, i) => {
          return <Item listItem={item} key={i} />;
        })}
      </section>
    </div>
  );
}

export default App;
