import { createStore } from 'redux';
import updateUser from '../reducer/updateUser';

const store = createStore(updateUser);

export default store;
