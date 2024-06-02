import React from 'react';
import { Provider } from 'mobx-react';
import { userStore } from "./src/stores/UserStore";
import App from './App';

const Root = () => (
  <Provider userStore={userStore}>
    <App />
  </Provider>
);

export default Root;
