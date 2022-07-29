import type { ListItem } from "@prisma/client";
import "./item.css";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  return (
    <div className="ads-container">
      <div className="btn-con">
        <a
          href={`http://www.arbetsformedlingen.se${listItem.url}`}
          className="button"
        >
          view
        </a>
      </div>
      <h2 className="position">{listItem.position}</h2>
      <h3>{listItem.company}</h3>
      <p className="desc" dangerouslySetInnerHTML={{ __html: listItem.desc }} />
    </div>
  );
}
