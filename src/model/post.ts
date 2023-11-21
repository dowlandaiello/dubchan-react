import { Timestamp } from "./timestamp";

/// A post.
export interface Post {
  id: number;
  posted_at: Timestamp;
  title: string;
  text: string;
  src: string | null;
  user_id: string | null;
  live: boolean;
  tags: [string | null] | null;
  n_comments: number;
  last_updated: Timestamp;
  views: number;
}

export const emptyPost = {
  title: "",
  text: "",
  live: false,
  author: undefined,
  tags: undefined,
  captcha_response: undefined,
};

/// A request creating a new post.
export interface NewPostBody {
  title: string;
  text: string;
  author: string | undefined;
  live: boolean;
  tags: string[] | undefined;
  captcha_response: string | undefined;
}
