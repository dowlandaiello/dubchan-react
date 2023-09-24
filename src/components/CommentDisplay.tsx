import { ThreadNode } from "../model/comment";
import style from "./CommentDisplay.module.css";
import { TimestampLabel } from "./TimestampLabel";
import { UsernameLabel } from "./UsernameLabel";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { MediaViewer } from "./MediaViewer";
import { NewComment } from "./NewComment";
import { useContext } from "react";
import { FeedContext } from "./Feed";
import { GreenText } from "./GreenText";

export const CommentDisplay = ({
  comment,
  tree,
  currentlyReplying,
  onReply,
}: {
  comment: ThreadNode;
  tree: { [id: number]: ThreadNode };
  currentlyReplying: number | null;
  onReply: (comment: number | null) => void;
}) => {
  const [, setLastUpdated] = useContext(FeedContext);
  const children = comment.children
    .sort((a, b) => b.posted.secs_since_epoch - a.posted.secs_since_epoch)
    .map((child) => (
      <CommentDisplay
        onReply={onReply}
        currentlyReplying={currentlyReplying}
        key={child.id}
        comment={tree[child.id]}
        tree={tree}
      />
    ));

  const reload = () => {
    setLastUpdated(Date.now());
  };

  return (
    <div className={style.section}>
      <div className={style.timestampRow}>
        <TimestampLabel timestamp={comment.comment.posted} />
        {comment.comment.user_id && (
          <UsernameLabel username={comment.comment.user_id} />
        )}
        <Image
          className={`${clickable.clickable} ${style.replyIcon}`}
          src="/reply.svg"
          height={15}
          width={15}
          alt="Reply icon."
          onClick={() => onReply(comment.comment.id)}
        />
      </div>
      <div className={style.commentText}>
        <GreenText>{comment.comment.text}</GreenText>
      </div>
      {comment.comment.src && (
        <MediaViewer
          className={style.media}
          src={comment.comment.src}
          expandable
        />
      )}
      {currentlyReplying === comment.comment.id && (
        <NewComment
          className={style.replyArea}
          key={comment.comment.id}
          parentPost={comment.comment.post_id}
          parentComment={comment.comment.id}
          onSubmitted={() => {
            reload();
            onReply(null);
          }}
          onClear={() => onReply(null)}
        />
      )}
      <div className={style.children}>{children}</div>
    </div>
  );
};
