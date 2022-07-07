import type { ListItem } from "@prisma/client";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  return (
    <div>
      <h2>{listItem.title}</h2>
      <p>{listItem.id}</p>
      <h2>{listItem.position}</h2>
      <h2>{listItem.company}</h2>
      <h2>{listItem.title}</h2>
    </div>
  );
}
