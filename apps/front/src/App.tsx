import type { ListItem } from "@prisma/client";

import { useEffect, useState } from "react";
import Item from "./components/Item";
import "./App.css";

function App() {
  const [data, setData] = useState<ListItem[]>([]);

  async function hej() {
    let a = await fetch("http://localhost:3000/listitems");
    let b = await a.json();
    setData(b);
  }

  useEffect(() => {
    hej();
  }, []);

  return (
    <div className="App">
      <h1> Front end </h1>

      <section>
        {data.map((item, i) => {
          return <Item listItem={item} />;
        })}
      </section>
    </div>
  );
}

export default App;
