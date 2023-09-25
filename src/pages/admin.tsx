import { useIdentitiesSsr } from "../util/hooksSsr";
import { GetServerSideProps } from "next";
import { AnalyticsWindow } from "../model/analytics";
import { routeSsr } from "../util/http";
import style from "./admin.module.css";
import Image from "next/image";
import { useState } from "react";
import clickable from "../components/Clickable.module.css";

export interface AnalyticsProps {
  data?: { [frame: string]: AnalyticsWindow };
}

export default ({ data }: AnalyticsProps) => {
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

  const [activeStat, setActiveStat] = useState<string>("day");

  const properNames: { [name: string]: string } = {
    hour: "Hour",
    day: "Day",
    week: "Week",
    month: "Month",
  };

  const selectedData = data
    ? data[activeStat]
    : { n_users: 0, n_posts: 0, n_comments: 0 };
  const datas = (
    <div className={style.dataSection}>
      <div className={style.dataLabel}>
        <h2>Stats:</h2>
        {Object.entries(properNames).map(([id, name]) => (
          <h2
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

export const getServerSideProps: GetServerSideProps<AnalyticsProps> = async (
  context
) => {
  const { users } = await useIdentitiesSsr(context.req);

  if (!users["dev"]) {
    const { res } = context;
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const analRequest: { [timeFrame: string]: [number, number] } = {
    hour: [Date.now() - 3600 * 1000, Date.now()],
    day: [Date.now() - 86400 * 1000, Date.now()],
    week: [Date.now() - 604800 * 1000, Date.now()],
    month: [Date.now() - 2592000 * 1000, Date.now()],
  };

  const results: { [window: string]: AnalyticsWindow } = (
    await Promise.all(
      Object.entries(analRequest).map(([key, [start, end]]) =>
        fetch(routeSsr(`/analytics?start=${start}&end=${end}`, context.req), {
          headers: { Authorization: users["dev"].token },
        })
          .then((body) => body.json())
          .then((json: AnalyticsWindow) => [key, json])
      )
    )
  ).reduce((accum, [key, json]) => {
    return { ...accum, [key as string]: json };
  }, {});

  return {
    props: { data: results },
  };
};
