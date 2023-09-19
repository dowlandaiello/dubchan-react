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

/// A request creating a new post.
export interface NewPostBody {
  title: string;
  text: string;
  author: string | undefined;
  tags: string[] | undefined;
  captcha_response: string | undefined;
}
