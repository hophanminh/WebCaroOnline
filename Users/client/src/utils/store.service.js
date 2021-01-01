import { createStore } from 'redux';
import AuthService from "./auth.service";
import reducer from '../reducer/reducer';

const store = createStore(reducer, { user: AuthService.getCurrentUser() });

export default store;
