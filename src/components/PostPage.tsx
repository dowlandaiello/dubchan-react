import style from "./PostPage.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { Post } from "../model/post";
import { ThreadNode, Comment } from "../model/comment";
import { useRouter } from "next/router";
import { route } from "../util/http";
import { PostBody } from "./PostBody";
import { useState, useEffect, useContext } from "react";
import { NewComment } from "./NewComment";
import { CommentDisplay } from "./CommentDisplay";
import { FeedContext } from "./Feed";

export const PostPage = ({
  className,
  postId,
}: {
  className?: string;
  postId?: number;
}) => {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useContext(FeedContext);
  const [post, setPost] = useState<Post | null>(null);
  const [tree, setTree] = useState<{ [id: number]: ThreadNode }>({});
  const [currentlyReplying, setCurrentlyReplying] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!postId) return;

    (async () => {
      // Load the post
      const post = await (await fetch(route(`/posts/${postId}`))).json();

      setPost(post);
      await loadComments();
    })();
  }, [postId, lastUpdated]);

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
    setTree(built);
  };

  const threads = Object.values(tree)
    .filter((comment) => !comment.comment.parent_comment)
    .map((thread) => (
      <CommentDisplay
        currentlyReplying={currentlyReplying}
        onReply={(id) => setCurrentlyReplying(id)}
        key={thread.comment.id}
        comment={thread}
        tree={tree}
      />
    ));

  const reload = () => {
    setLastUpdated(Date.now());
  };

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
            onClick={router.back}
          />
        </div>
        {post ? (
          <PostBody
            key="loaded"
            className={style.body}
            blurred={true}
            post={post}
          />
        ) : (
          <PostBody
            key="loading"
            className={style.loadingBody}
            blurred={false}
          />
        )}
        {!currentlyReplying && (
          <NewComment
            key={postId}
            parentPost={postId ?? 0}
            onSubmitted={reload}
          />
        )}
        <div className={style.comments}>
          {threads}
          <div style={{ minHeight: "1em" }}></div>
        </div>
      </div>
    </div>
  );
};
