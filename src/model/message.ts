import { Timestamp } from "./timestamp";

export interface Message {
  user_id: string;
  sender: string;
  message_id: number;
  sent_at: Timestamp;
  text: string;
  text_sender: string;
  parent_message: number | undefined;
  src: string | undefined;
  viewed: boolean;
}

export interface NewMessageBody {
  text: string;
  user_id: string;
  sender: string;
}

export const emptyMessage: NewMessageBody = {
  text: "",
  user_id: "",
  sender: "",
};

export interface Inbox {
  user_id: string;
  sender: string;
}
