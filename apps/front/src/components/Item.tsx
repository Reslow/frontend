import type { ListItem } from "@prisma/client";
import parse from "html-react-parser";
import "./item.css";

type Props = {
  listItem: ListItem;
};

export default function Item({ listItem }: Props) {
  let str = listItem.title;

  const reactElement = parse(str);
  console.log(reactElement);

  function handle(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log(e);
  }

  return (
    <div className="bg">
      <button type="button" onClick={handle}>
        {reactElement}
      </button>
      <p>{listItem.position}</p>
      <p>{listItem.company}</p>
      <p>{listItem.url}</p>
      {listItem.title}
    </div>
  );
}
