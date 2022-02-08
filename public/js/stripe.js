/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import {loadStripe} from '@stripe/stripe-js';


export const BookTravel = async travelId => {
  try {
		// get checkout session from endpoint
		const session = await axios(
			`http://127.0.0.1:3000/api/v1/bookings/checkout-stripe/${travelId}`
		)
		//console.log(session)
		const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
		await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
		

	} catch (error) {
		console.log(error);
    	showAlert('error', error);
	}
}
