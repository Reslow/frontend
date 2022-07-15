import type { ListItem } from "@prisma/client";
import "./item.css";
import Parser from "html-react-parser";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  console.log(listItem.desc);
  return (
    <div className="ads-container">
      <p dangerouslySetInnerHTML={{ __html: listItem.desc }} />
      <a href={`http://www.arbetsformedlingen.se${listItem.url}`}>to ad</a>
    </div>
  );
}
