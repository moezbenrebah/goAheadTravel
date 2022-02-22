/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { forgotPassword } from './forgotpassword';
import { resetPassword } from './resetpassword'
import { BookTravel } from './stripe';
import { showAlert } from './alerts'


const loginForm = document.querySelector('.form--login');
const logOut = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const updateSettingsForm = document.querySelector('.form-user-data');
const forgotPasswordForm = document.querySelector('.forgotpassword-form');
const resetPasswordForm = document.querySelector('.resetpassword--form');
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
    const email = document.querySelector('input#email').value;
    const password = document.querySelector('input#password').value;
    login(email, password);

    // clear fields
    document.querySelector('input#email').value = '';
    document.querySelector('input#password').value = '';
  });
};

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    // display feedback to users
    document.getElementById('reset-btn').textContent = 'Resetting...';

    const email = document.querySelector('input#email').value;
    forgotPassword(email);

    // clear email field
    document.querySelector('input#email').value = '';
    document.getElementById('reset-btn').textContent = 'RESET MY PASSWORD';
  });
};

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const password = document.querySelector('input#password').value;
    const passwordValidation = document.querySelector('input#passwordValidation').value;
    const token = document.querySelector('input#resetToken').value;
    await resetPassword(password, passwordValidation, token);
  })
}

if (logOut) logOut.addEventListener('click', logout);

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

// retrieve the travel whenever a booking button hited
if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing ...';
    const { travelId } = e.target.dataset;
    BookTravel(travelId);
  })
}

// show alerts views templates
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage);
