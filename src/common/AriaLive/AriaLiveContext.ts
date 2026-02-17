import { createContext } from 'react';

const AriaLiveContext = createContext<{
  message: string;
  sendMessage: (message: string) => void;
}>({
  message: '',

  sendMessage: () => {},
});

export default AriaLiveContext;
