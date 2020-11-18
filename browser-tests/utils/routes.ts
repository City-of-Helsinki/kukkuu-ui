import { envUrl } from '../utils/settings';

export const routes = {
  messagesList: () => `${envUrl()}/messages`,
  messagesCreate: () => `${envUrl()}/messages/create`,
  messagesDetails: (messageId: string) =>
    `${envUrl()}/messages/${messageId}/show`,
  messagesEdit: (messageId: string) => `${envUrl()}/messages/${messageId}`,
};
