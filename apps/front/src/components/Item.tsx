import type { ListItem } from "@prisma/client";
import "./item.css";
import { Markup } from "interweave";
import Parser from "html-react-parser";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  const description = listItem.desc;

  return (
    <div className="bg">
      <p>{listItem.position}</p>
      <p>{listItem.company}</p>
      <a href={`http://www.arbetsformedlingen.se${listItem.url}`}>to ad</a>
      <p>{Parser(description)}</p>
      {/* <Markup content={description} /> */}
    </div>
  );
}
