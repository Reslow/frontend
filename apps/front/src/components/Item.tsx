import type { ListItem } from "@prisma/client";
import "./item.css";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  console.log(listItem.desc);
  return (
    <div className="ads-container">
      <h2>{listItem.position}</h2>
      <h2>{listItem.company}</h2>
      <a
        href={`http://www.arbetsformedlingen.se${listItem.url}`}
        className="button"
      >
        to ad
      </a>
      <p className="desc" dangerouslySetInnerHTML={{ __html: listItem.desc }} />
    </div>
  );
}
