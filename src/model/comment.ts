import { Timestamp } from "./timestamp";

export interface Comment {
  id: number;
  post_id: number;
  parent_comment?: number;
  posted: Timestamp;
  text: string;
  src?: string;
  user_id?: string;
}

export interface NewCommentBody {
  parent_comment?: string;
  text: string;
  author?: string;
  captcha_response?: string;
}

export const emptyComment: NewCommentBody = {
  text: "",
};
