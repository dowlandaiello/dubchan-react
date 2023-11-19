"use client";

import { AnalyticsWindow } from "../model/analytics";
import { route } from "../util/http";
import style from "./admin.module.css";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { AuthenticationContext } from "../components/AccountSelection";
import clickable from "../components/Clickable.module.css";

export default () => {
  const [data, setData] = useState<
    undefined | { [window: string]: AnalyticsWindow }
  >(undefined);
  const [{ users, activeUser }] = useContext(AuthenticationContext);
  const snek = Array(500)
    .fill(0)
    .map((_, i) => (
      <Image
        key={i}
        src="/gadsden.svg"
        height={80}
        width={80}
        className={style.gadsden}
        alt="Gadsden."
      />
    ));

  useEffect(() => {
    (async () => {
      if (!activeUser) return;

      const analRequest: { [timeFrame: string]: [number, number] } = {
        hour: [Date.now() - 3600 * 1000, Date.now()],
        day: [Date.now() - 86400 * 1000, Date.now()],
        week: [Date.now() - 604800 * 1000, Date.now()],
        month: [Date.now() - 2592000 * 1000, Date.now()],
      };

      const results: { [window: string]: AnalyticsWindow } = (
        await Promise.all(
          Object.entries(analRequest).map(([key, [start, end]]) =>
            fetch(route(`/analytics?start=${start}&end=${end}`), {
              headers: { Authorization: users[activeUser].token },
            })
              .then((body) => body.json())
              .then((json: AnalyticsWindow) => [key, json])
          )
        )
      ).reduce((accum, [key, json]) => {
        return { ...accum, [key as string]: json };
      }, {});
      setData(results);
    })();
  }, [activeUser, users]);

  const [activeStat, setActiveStat] = useState<string>("day");

  const properNames: { [name: string]: string } = {
    hour: "Hour",
    day: "Day",
    week: "Week",
    month: "Month",
  };

  const selectedData = data
    ? data[activeStat]
    : { n_users: 0, n_posts: 0, n_comments: 0, n_views: 0 };
  const datas = (
    <div className={style.dataSection}>
      <div className={style.dataLabel}>
        <h2>Stats:</h2>
        {Object.entries(properNames).map(([id, name]) => (
          <h2
            key={id}
            onClick={() => setActiveStat(id)}
            className={`${activeStat === id ? style.active : ""} ${
              clickable.clickable
            }`}
          >
            {name}
          </h2>
        ))}
      </div>
      <div className={style.dataList}>
        <div className={style.stat}>
          <h1>{selectedData.n_users}</h1>
          New Users
        </div>
        <div className={style.stat}>
          <h1>{selectedData.n_posts}</h1>
          New Posts
        </div>
        <div className={style.stat}>
          <h1>{selectedData.n_comments}</h1>
          New Comments
        </div>
        <div className={style.stat}>
          <h1>{selectedData.n_views}</h1>
          Total Views
        </div>
      </div>
    </div>
  );

  return (
    <div className={style.section}>
      <div className={style.bgContainer}>
        <div className={style.bg}>{snek}</div>
      </div>
      <div className={style.titleLine}>
        <h1>The Throne</h1>
      </div>
      {datas}
    </div>
  );
};
