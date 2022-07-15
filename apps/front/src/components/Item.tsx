import type { ListItem } from "@prisma/client";
import "./item.css";
import Parser from "html-react-parser";

import { useEffect, useState } from "react";
import { isString } from "util";
import { setEmitFlags } from "typescript";
import { stringify } from "querystring";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  const [solo, setSolo] = useState(false);
  const [listOfItems, setListOfItems] = useState<string[] | object[]>();
  const [text, setText] = useState<string | undefined>();
  const [el, setEl] = useState<JSX.Element | JSX.Element[]>();

  useEffect(() => {
    const data = listItem.desc;
    let arr = data?.split("<p>,</p>");
    console.log(arr);
    console.log(listOfItems);
    setListOfItems(arr);
    checkTyp(listOfItems);
  }, [listItem.desc, listOfItems]);

  function checkTyp(listOfItems: (string | object)[] | undefined) {
    let e: any;
    if (listOfItems !== undefined) {
      listOfItems?.forEach((item) => {
        if (typeof item === "string") setSolo(!solo);
        // it's a string
        e = Parser(item);
        setEl(e);
      });
    }
    // console.log(text, "text");
  }
  console.log("e", el);
  return (
    <div className="ads-container">
      <div className={`banner ${solo ? "solo" : "texts"}`}></div>
      {el !== undefined && el}
      <a href={`http://www.arbetsformedlingen.se${listItem.url}`}>to ad</a>
    </div>
  );
}
