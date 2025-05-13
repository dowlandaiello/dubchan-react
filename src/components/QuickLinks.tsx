import style from "./QuickLinks.module.css";
import Link from "next/link";
import clickable from "./Clickable.module.css";
import { route } from "../util/http";
import { useState, useEffect, useContext } from "react";
import { AuthenticationContext } from "./AccountSelection";

export const QuickLinks = () => {
  const [qotd, setQotd] = useState<string>("");
  const [{ activeUser }] = useContext(AuthenticationContext);

  const links = [
    { text: "About", postId: 1 },
    { text: "Account Privacy & Moderation", postId: 10 },
    { text: "Bug Reports / Features", postId: 4 },
  ];
  const linkLabels = links.map((link) => {
    return (
      <Link
        className={clickable.clickable}
        key={link.text}
        href={`/?post=${link.postId}`}
      >
        {link.text}
      </Link>
    );
  });

  useEffect(() => {
    (async () => {
      const qotd = await (await fetch(route("/qotd"))).json().catch(() => "");
      setQotd(qotd);
    })();
  }, []);

  return (
    <div className={style.section}>
      <div className={style.links}>
        {linkLabels}{" "}
        {activeUser === "dev" && (
          <Link
            className={clickable.clickable}
            key={"analytics"}
            href={"/admin"}
          >
            Admin
          </Link>
        )}
      </div>
      {qotd !== "" && <p className={style.qotd}>{qotd}</p>}
    </div>
  );
};
