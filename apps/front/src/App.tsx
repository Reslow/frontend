import type { ListItem } from "@prisma/client";

import { useEffect, useState } from "react";
import Item from "./components/Item";
import "./App.css";

function App() {
  const [data, setData] = useState<ListItem[]>([]);

  async function getData() {
    let response = await fetch("http://localhost:3000/listitems");
    let data = await response.json();
    setData(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <h1> Front end </h1>

      <section>
        {data.map((item, i) => {
          return <Item listItem={item} key={i} />;
        })}
      </section>
    </div>
  );
}

export default App;
