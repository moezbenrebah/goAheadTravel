/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotpassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Please check you email box');
      window.setTimeout(() => {
	      location.assign('/forgotpassword');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
    window.setTimeout(() => {
      location.assign('/forgotpassword');
    }, 500);
  }
};
