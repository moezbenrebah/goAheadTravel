/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { BookTravel } from './stripe';


const loginForm = document.querySelector('.form--login');
const logOut = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const updateSettingsForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-travel');

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const formField = new FormData();
    formField.append('name', document.getElementById('name').value);
		formField.append('email', document.getElementById('email').value);
    formField.append('password', document.getElementById('password').value);
    formField.append('passwordValidation', document.getElementById('passwordValidation').value);

		signup(formField, 'data');
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
    const formField = new FormData();
    formField.append('name', document.getElementById('name').value);
		formField.append('email', document.getElementById('email').value);
    formField.append('photo', document.getElementById('photo').files[0]);

		updateSettings(formField, 'data');
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

if (bookBtn) {
  bookBtn.addEventListener('click', async e => {
    e.target.textContent = 'Processing ...';
    const { travelId } = e.target.dataset;
    BookTravel(travelId);
  })
}
  