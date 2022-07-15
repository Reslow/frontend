import type { ListItem } from "@prisma/client";
import "./item.css";
import Parser from "html-react-parser";

import { useEffect, useState } from "react";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  const [solo, setSolo] = useState(false);
  const [listOfItems, setListOfItems] = useState<(string | object)[]>();

  useEffect(() => {
    const data = listItem.desc;
    let arr = data?.split("<p>,</p>");
    console.log(arr);
    console.log(listOfItems);
    setListOfItems(arr);
  }, [listItem.desc, listOfItems]);

  if (listOfItems !== undefined && (listOfItems as string[])) {
    console.log(listOfItems);
  }

  return (
    <div className="ads-container">
      s<h1>{listItem.position}</h1>
      <h2>{listItem.company}</h2>
      <div className={`banner ${solo ? "solo" : "texts"}`}>{listOfItems}</div>
      <a href={`http://www.arbetsformedlingen.se${listItem.url}`}>to ad</a>
    </div>
  );
}
