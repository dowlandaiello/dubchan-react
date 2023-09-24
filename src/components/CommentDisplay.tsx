import { ThreadNode } from "../model/comment";
import style from "./CommentDisplay.module.css";
import { TimestampLabel } from "./TimestampLabel";
import { UsernameLabel } from "./UsernameLabel";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { MediaViewer } from "./MediaViewer";

export const CommentDisplay = ({
  comment,
  tree,
}: {
  comment: ThreadNode;
  tree: { [id: number]: ThreadNode };
}) => {
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
        />
      </div>
      <p>{comment.comment.text}</p>
      {comment.comment.src && (
        <MediaViewer
          className={style.media}
          src={comment.comment.src}
          expandable
        />
      )}
    </div>
  );
};
