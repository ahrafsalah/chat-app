import { UserType } from "./userType";

export interface ChatStore {
  messages: any[];
  users: UserType[];
  selectedUser: UserType | null;
  isUserLoading: boolean;
  isMessageLoaging: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: UserType) => void;
  sendMessage: (messageData: FormData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages : ()=> void
}