import "server-only";
import { useIdentitiesSsr } from "../util/hooksSsr";
import { GetServerSideProps } from "next";
import { AnalyticsWindow } from "../model/analytics";
import { routeSsr } from "../util/http";

export interface AnalyticsOverview {
  hourAnalytics: AnalyticsWindow;
  dayAnalytics: AnalyticsWindow;
  weekAnalytics: AnalyticsWindow;
  monthAnalytics: AnalyticsWindow;
}

export default () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps<AnalyticsOverview> = async (
  context
) => {
  const { users } = useIdentitiesSsr(context.req);

  if (!users["dev"]) {
    const { res } = context;
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return;
  }

  const analRequest: { [timeFrame: string]: [number, number] } = {
    hourAnalytics: [Date.now() - 3600 * 1000, Date.now()],
    dayAnalytics: [Date.now() - 86400 * 1000, Date.now()],
    weekAnalytics: [Date.now() - 604800 * 1000, Date.now()],
    monthAnalytics: [Date.now() - 2592000 * 1000, Date.now()],
  };

  const results: { [window: string]: AnalyticsWindow } = (
    await Promise.all(
      Object.entries(analRequest).map(([key, [start, end]]) =>
        fetch(routeSsr(`/analytics?start=${start}?end=${end}`, context.req))
          .then((body) => body.json())
          .then((json: AnalyticsWindow) => [key, json])
      )
    )
  ).reduce((accum, [key, json]) => {
    return { ...accum, [key as string]: json };
  }, {});

  return {
    props: { ...results },
  };
};
