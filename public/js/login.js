/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'

// login handler
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
			showAlert('success', 'Welcome back!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if (res.data.status = 'success') {
      showAlert('success', 'See you soon!');
      //location.reload(true);
			window.setTimeout(() => {
				location.assign('/');
			}, 1000);
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', 'Oops seems to be an error!');
  }
};
