import cadenzoApi from 'data/clients/utils';
import { FETCH_CHATS } from './queries';

export const fetchChats = oids => cadenzoApi.post(FETCH_CHATS, { oids });

export const fetchChatMessages = oids =>
  cadenzoApi.post(FETCH_CHAT_MESSAGES, { oids });
