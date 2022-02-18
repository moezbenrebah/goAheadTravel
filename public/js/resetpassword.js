/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'

export const resetPassword = async (password, passwordValidation, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url:` /api/v1/users/resetpassword/${token}`,
      data: {
        password,
        passwordValidation
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'your new password was updated correctly');
      window.setTimeout(() => {
	location.assign('/');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
