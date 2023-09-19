import style from "./QuickLinks.module.css";
import Link from "next/link";
import clickable from "./Clickable.module.css";
import { route } from "../util/http";
import { useState, useEffect } from "react";

export const QuickLinks = () => {
  const [qotd, setQotd] = useState<string>("");

  const links = [
    { text: "About", postId: 1 },
    { text: "Contact", postId: 2 },
  ];
  const linkLabels = links.map((link) => {
    return (
      <Link
        className={clickable.clickable}
        key={link.text}
        href={`/posts/${link.postId}`}
      >
        {link.text}
      </Link>
    );
  });

  useEffect(() => {
    (async () => {
      const qotd = await (await fetch(route("/qotd"))).json();
      setQotd(qotd);
    })();
  }, []);

  return (
    <div className={style.section}>
      <div className={style.links}>{linkLabels}</div>
      {qotd !== "" && <p className={style.qotd}>{qotd}</p>}
    </div>
  );
};
