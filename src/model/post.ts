import { Timestamp } from "./timestamp";

/// A post.
export interface Post {
  id: number;
  posted_at: Timestamp;
  title: string;
  text: string;
  src: string | null;
  user_id: string | null;
  tags: [string | null] | null;
  n_comments: number;
  last_updated: Timestamp;
}
