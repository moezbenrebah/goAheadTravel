/* eslint-disable */

export const hideAlert = () => {
	const element = document.querySelector('.alert');
	if (element) element.parentElement.removeChild(element);
}

export const showAlert = (type, msg) => {
	hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hideAlert, 5000);
}