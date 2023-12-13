import style from "./PostPage.module.css";
import bodyStyle from "./PostThumbnail.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { Post } from "../model/post";
import { Comment, ThreadNode } from "../model/comment";
import { useRouter } from "next/router";
import { route } from "../util/http";
import { PostBody } from "./PostBody";
import { useState, useEffect, useContext } from "react";
import { NewComment } from "./NewComment";
import { CommentDisplay } from "./CommentDisplay";
import { MessageDisplay } from "./MessageDisplay";
import { FeedContext, ThreadingContext } from "./Feed";
import { AuthenticationContext } from "./AccountSelection";
import { useSocket } from "../util/hooks";
import { Node } from "./MessageDisplay";

export const PostPage = ({
  className,
  postId,
}: {
  className?: string;
  postId?: number;
}) => {
  const router = useRouter();
  const [{ activeUser, users }] = useContext(AuthenticationContext);
  const [lastUpdated, setLastUpdated] = useContext(FeedContext);
  const [post, setPost] = useState<Post | null>(null);
  const [tree, setTree] = useState<{ [id: number]: ThreadNode }>({});
  const [messageTree, setMessageTree] = useState<{ [id: number]: Node }>({});
  const [mostRecent, setMostRecent] = useState<number | undefined>(undefined);
  const [currentlyReplying, setCurrentlyReplying] = useState<number | null>(
    null
  );
  const [threadingActive] = useContext(ThreadingContext);
  const [compact, setCompact] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const sock = useSocket();

  useEffect(() => {
    if (!postId) return;

    (async () => {
      // Load the post
      const post = await (await fetch(route(`/posts/${postId}`))).json();

      // Load the poll
      const poll = await (await fetch(route(`/posts/${postId}/poll`))).json();

      setPost({ ...post, poll: poll });
      await loadComments();
    })();
  }, [postId, lastUpdated]);

  useEffect(() => {
    if (!sock || !post || !post.live) return;

    // Subscribe to this room
    sock.send(`join ${post.id}`);

    // Listen for new messages
    sock.addEventListener("message", async (e) => {
      if (e.data.includes("error")) {
        console.error(e);

        return;
      }

      if (e.data.split(" ")[0].includes("MSG")) {
        loadComments();

        return;
      }

      const onlineCount = Number(e.data.split(" ")[1]);
      setOnlineCount(onlineCount);
    });
  }, [sock !== null, !post, post?.id]);

  useEffect(() => {
    if (!postId) return;

    const timer = () => {
      fetch(route(`/posts/${postId}/view`), { method: "POST" });
    };

    const timeout = setTimeout(timer, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const back = () => {
    router.back();
    router.push("/");

    if (post && sock) {
      sock.send(`exit ${post.id}`);
    }
  };

  useEffect(() => {
    const resizeListener = () => {
      if (window.innerWidth <= 827) {
        setCompact(true);

        return;
      }

      setCompact(false);
    };

    setTimeout(resizeListener, 100);

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("reisze", resizeListener);
    };
  }, []);

  const insertMessageTree = (
    accum: { [id: number]: Node },
    comment: Comment
  ): { [id: number]: Node } => {
    if (comment.parent_comment) {
      return {
        ...accum,
        [comment.parent_comment]: {
          ...accum[comment.parent_comment],
        },
        [comment.id]: {
          id: comment.id,
          parent: comment.parent_comment,
          time: comment.posted,
          text: comment.text,
          src: comment.src,
          user_id: comment.user_id,
        },
      };
    }

    return {
      ...accum,
      [comment.id]: {
        id: comment.id,
        parent: comment.parent_comment,
        time: comment.posted,
        text: comment.text,
        src: comment.src,
        user_id: comment.user_id,
      },
    };
  };

  const insertTree = (
    accum: { [id: number]: ThreadNode },
    comment: Comment
  ) => {
    if (comment.parent_comment) {
      return {
        ...accum,
        [comment.parent_comment]: {
          ...accum[comment.parent_comment],
          children: [...accum[comment.parent_comment].children, comment],
        },
        [comment.id]: { comment: comment, children: [] },
      };
    }

    return { ...accum, [comment.id]: { comment: comment, children: [] } };
  };

  const loadComments = async () => {
    const comments: Comment[] = await (
      await fetch(route(`/posts/${postId}/comments`))
    )
      .json()
      .catch(() => []);
    const built: { [id: number]: ThreadNode } = comments.reduce(insertTree, {});
    const builtMessageTree: { [id: number]: Node } = comments.reduce(
      insertMessageTree,
      {}
    );
    setTree(built);
    setMessageTree(builtMessageTree);

    const mostRecent =
      comments.sort(
        (a, b) => b.posted.secs_since_epoch - a.posted.secs_since_epoch
      )[0]?.id ?? undefined;
    setMostRecent(mostRecent);
  };

  const reload = () => {
    setLastUpdated(Date.now());
  };

  const deleteComment = async (id: number) => {
    const headers = activeUser
      ? {
          Authorization: users[activeUser]?.token ?? "",
        }
      : undefined;

    await fetch(route(`/comments/${id}`), {
      method: "DELETE",
      headers: headers,
    });
    reload();
  };

  const threads = Object.values(tree)
    .filter((comment) => !comment.comment.parent_comment)
    .sort(
      (a, b) =>
        b.comment.posted.secs_since_epoch - a.comment.posted.secs_since_epoch
    )
    .map((thread) => (
      <CommentDisplay
        currentlyReplying={post?.live ? null : currentlyReplying}
        mostRecent={mostRecent}
        onReply={(id) => setCurrentlyReplying(id)}
        key={thread.comment.id}
        comment={thread}
        tree={tree}
        deletable={activeUser === "dev"}
        onClickDelete={() => deleteComment(thread.comment.id)}
        compact={!threadingActive}
      />
    ));

  const messages = post?.live
    ? Object.values(messageTree)
        .sort((a, b) => b.time.secs_since_epoch - a.time.secs_since_epoch)
        .map((thread) => (
          <MessageDisplay
            onReply={(id) => setCurrentlyReplying(id)}
            key={thread.id}
            comment={thread}
            tree={messageTree}
            deletable={activeUser === "dev"}
            onClickDelete={() => deleteComment(thread.id)}
          />
        ))
    : [];

  return (
    <div className={`${style.container} ${className}`}>
      <div className={style.section}>
        <div className={style.navSection}>
          <Image
            className={clickable.clickable}
            src="/back.svg"
            height={30}
            width={30}
            alt="Back button."
            onClick={back}
          />
        </div>
        {post ? (
          <PostBody
            key="loaded"
            className={style.body}
            mediaClassName={style.bodyMedia}
            blurred={true}
            post={post}
            compact={compact}
            expandedText
          />
        ) : (
          <PostBody
            key="loading"
            className={style.loadingBody}
            mediaClassName={style.media}
            blurred={false}
            compact={compact}
            expandedText
          />
        )}
        {!currentlyReplying && !post?.live && (
          <NewComment
            key={postId}
            parentPost={postId ?? 0}
            onSubmitted={reload}
          />
        )}
        {post?.live && false && (
          <div className={style.onlineLabel}>
            <Image
              className={bodyStyle.liveIcon}
              src="/broadcast.svg"
              height={15}
              width={15}
              alt="Live icon."
            />{" "}
            <p>{onlineCount == 0 ? onlineCount : onlineCount - 1} online</p>
          </div>
        )}
        {post?.live ? (
          <div className={style.log}>{messages}</div>
        ) : (
          <div className={style.comments}>
            {threads}
            <div style={{ minHeight: "1em" }}></div>
          </div>
        )}
        {currentlyReplying && post?.live && (
          <p>
            Replying to <b>{tree[currentlyReplying].comment.text}</b>
          </p>
        )}
        {post?.live && (
          <NewComment
            key={postId}
            parentPost={postId ?? 0}
            parentComment={currentlyReplying ?? undefined}
            onSubmitted={() => {
              reload();
              setCurrentlyReplying(null);
            }}
            onClear={() => setCurrentlyReplying(null)}
            live
          />
        )}
      </div>
      <div className={style.backdrop} onClick={back} />
      <div className={style.backdropL} onClick={back} />
    </div>
  );
};
