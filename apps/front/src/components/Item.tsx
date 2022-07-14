import type { ListItem } from "@prisma/client";
import "./item.css";
import Parser from "html-react-parser";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  const description = listItem.desc;
  const data = Parser(description);
  return (
    <div className="bg">
      <h1>{listItem.position}</h1>
      <h2>{listItem.company}</h2>
      <p>{data}</p>
      <a href={`http://www.arbetsformedlingen.se${listItem.url}`}>to ad</a>
    </div>
  );
}
