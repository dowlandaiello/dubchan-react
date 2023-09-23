import { Post } from "../model/post";
import { useEffect, useState, useRef, Fragment } from "react";
import { route } from "../util/http";
import { PostThumbnail } from "./PostThumbnail";
import style from "./Feed.module.css";
import { FeedControl } from "./FeedControl";
import { timestampToUnix } from "../util/format";
import { NewPost } from "./NewPost";
import { QuickLinks } from "../components/QuickLinks";

/// Renders a configurable feed/grid of posts.
export const Feed = () => {
  const [posts, setPosts] = useState<Map<number, Post>>(new Map());
  const [snapshot, setSnapshot] = useState<number[]>([]);
  const [loadOngoing, setLoadOngoing] = useState<Boolean>(false);
  const [gridToggled, setGridToggled] = useState<Boolean>(true);
  const [blurred, setBlurred] = useState<Boolean>(true);
  const [activeTags, setActiveTags] = useState<string[]>([
    "UW",
    "Fitness",
    "LGBT",
    "NSFW",
  ]);
  const feedRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<Map<number, Post>>();
  stateRef.current = posts;

  const snapshotRef = useRef<number[]>();
  snapshotRef.current = snapshot;

  const toggleGrid = (toggled: Boolean) => {
    setGridToggled(toggled);
  };

  const toggleBlur = (blurred: Boolean) => {
    setBlurred(blurred);
  };

  const loadBatch = async () => {
    const posts = stateRef.current;
    const snapshot = snapshotRef.current;

    if (!posts) return;
    if (!snapshot) return;

    const startingSize = posts.size;

    // If no posts are left, trigger a before:date load
    if (startingSize + 7 - startingSize == 0) {
      const postIds = await (
        await fetch(
          route(
            `/feed/snapshot?before=${timestampToUnix(
              posts.get(snapshot[snapshot.length - 1])?.last_updated ?? {
                secs_since_epoch: 0,
                nanos_since_epoch: 0,
              }
            )}`
          )
        )
      )
        .json()
        .catch(() => []);
      setSnapshot((snapshot) => [...snapshot, ...postIds]);

      return;
    }

    // Load all posts
    await Promise.all(
      snapshot.slice(startingSize, startingSize + 7).map(async (id: number) => {
        // Load the post
        const post = await (await fetch(route(`/posts/${id}`))).json();

        setPosts((posts) => new Map(posts.set(id, post)));
      })
    );

    setLoadOngoing(false);
  };

  const search = async (term: string) => {
    const postIds = await (await fetch(route(`/posts?like=${term}`)))
      .json()
      .catch(() => []);
    setPosts(new Map());
    setSnapshot(postIds);
  };

  const changeTags = async (tags: string[]) => {
    setActiveTags(tags);
  };

  const loadInit = async () => {
    setPosts(new Map());

    // Fetch 50 post ID's
    const postIds = await (
      await fetch(
        route(
          activeTags.length < 4
            ? `/feed/snapshot?tags=${JSON.stringify(activeTags)}`
            : "/feed/snapshot"
        )
      )
    )
      .json()
      .catch(() => []);
    setSnapshot(postIds);
  };

  // Load initial post ID's
  useEffect(() => {
    loadInit();
  }, []);

  // Load post ID's when tags change
  useEffect(() => {
    loadInit();
  }, [activeTags]);

  useEffect(() => {
    // Whenever the user reaches 80% of the scroll height, load more posts
    const listener = () => {
      if (feedRef.current) {
        if (
          Math.abs(
            feedRef.current.scrollHeight -
              feedRef.current.scrollTop -
              feedRef.current.clientHeight
          ) <
          feedRef.current.clientHeight * 0.1
        ) {
          if (!loadOngoing) {
            setLoadOngoing(true);
            loadBatch();
          }
        }
      }
    };

    if (feedRef.current) feedRef.current.addEventListener("scroll", listener);

    return () => {
      if (feedRef.current)
        feedRef.current.removeEventListener("scroll", listener);
    };
  }, [feedRef.current]);

  // Load initial posts
  useEffect(() => {
    if (snapshot !== []) loadBatch();
  }, [snapshot]);

  const postEntries =
    posts.size > 0
      ? Array.from(posts.values())
          .sort(
            (a: Post, b: Post) =>
              b.last_updated.secs_since_epoch - a.last_updated.secs_since_epoch
          )
          .map((post: Post) => (
            <Fragment key={post.id}>
              <PostThumbnail
                post={post}
                key={post.id}
                blurred={blurred}
                compact={gridToggled}
              />
            </Fragment>
          ))
      : Array(5).fill(<PostThumbnail blurred={blurred} />);

  return (
    <div className={`${gridToggled ? style.grid : style.feed}`} ref={feedRef}>
      <div className={style.gridHeader}>
        <QuickLinks />
        <NewPost onSubmitted={loadInit} />
        <FeedControl
          onGridToggled={toggleGrid}
          onBlurToggled={toggleBlur}
          onSearch={search}
          onClear={loadInit}
          onChangeTags={changeTags}
        />
      </div>
      {postEntries}
    </div>
  );
};
