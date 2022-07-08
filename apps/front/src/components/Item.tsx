import type { ListItem } from "@prisma/client";
import "./item.css";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  return (
    <div className="bg">
      <p>{listItem.position}</p>
      <p>{listItem.company}</p>
      <a href={`http://www.arbetsformedlingen.se${listItem.url}`}>to ad</a>
    </div>
  );
}
