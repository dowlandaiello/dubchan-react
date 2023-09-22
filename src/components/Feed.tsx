import { Post } from "../model/post";
import { useEffect, useState, useRef, Fragment } from "react";
import { route } from "../util/http";
import { PostThumbnail } from "./PostThumbnail";
import style from "./Feed.module.css";
import { FeedControl } from "./FeedControl";
import { NewPost } from "./NewPost";
import { QuickLinks } from "../components/QuickLinks";

/// Renders a configurable feed/grid of posts.
export const Feed = () => {
  const [posts, setPosts] = useState<Map<number, Post>>(new Map());
  const [snapshot, setSnapshot] = useState<number[]>([]);
  const [loadOngoing, setLoadOngoing] = useState<Boolean>(false);
  const [gridToggled, setGridToggled] = useState<Boolean>(true);
  const [blurred, setBlurred] = useState<Boolean>(true);
  const feedRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<Map<number, Post>>();
  stateRef.current = posts;

  const toggleGrid = (toggled: Boolean) => {
    setGridToggled(toggled);
  };

  const loadBatch = async () => {
    const posts = stateRef.current;

    if (!posts) return;

    const startingSize = posts.size;

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

  const loadInit = async () => {
    setPosts(new Map());

    // Fetch 50 post ID's
    const postIds = await (await fetch(route("/feed/snapshot")))
      .json()
      .catch(() => []);
    setSnapshot(postIds);
  };

  // Load initial post ID's
  useEffect(() => {
    loadInit();
  }, []);

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

  const postEntries = Array.from(posts.values())
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
    ));

  return (
    <div className={`${gridToggled ? style.grid : style.feed}`} ref={feedRef}>
      <div className={style.gridHeader}>
        <QuickLinks />
        <NewPost onSubmitted={loadInit} />
        <FeedControl
          onGridToggled={toggleGrid}
          onSearch={search}
          onClear={loadInit}
        />
      </div>
      {postEntries}
    </div>
  );
};
