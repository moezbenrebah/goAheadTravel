/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const logOut = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const updateSettingsForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordValidation = document.getElementById('passwordValidation').value;

    signup(name, email, password, passwordValidation);
  });
}

if (loginForm) {
	loginForm.addEventListener('submit', e => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});
};

if (logOut) logOut.addEventListener('click', logout)

if (updateSettingsForm) {
  updateSettingsForm.addEventListener('submit', e => {
    e.preventDefault();
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		updateSettings({ name, email }, 'data');
  })
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    // Give user feedback
    document.querySelector('.btn--save-password').textContent = 'Updating...';

		const currentPassword = document.getElementById('current-password').value;
		const password = document.getElementById('password').value;
    const passwordValidation = document.getElementById('password-validation').value;
    await updateSettings({ currentPassword, password, passwordValidation }, 'password');

    // Clear current password, password, and password validation
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('current-password').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-validation').value = '';
  });
}
  