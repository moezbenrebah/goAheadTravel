/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import Stripe from 'stripe';

const stripe = new Stripe('pk_test_51KOktUA1H3VpG3RzpJaw3scJ5F8EoaqeITHyjhQf5I9HKICdXef672PeVTZ3UuE9hyiCYSRbV0UyLeYlM6sSha9M002uPlCVpg');

export const BookTravel = async travelId => {
  try {
		// get checkout session from endpoint
		const session = await axios({
			method: 'GET',
			url: `http://127.0.0.1:3000/api/v1/bookings/checkout-stripe/${travelId}`
		})
		//console.log(session);

		// create checkout form + charge credit card bank
		//const stripe = await loadStripe('pk_test_51KOktUA1H3VpG3RzpJaw3scJ5F8EoaqeITHyjhQf5I9HKICdXef672PeVTZ3UuE9hyiCYSRbV0UyLeYlM6sSha9M002uPlCVpg');
		await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

	} catch (error) {
		console.log(error);
    	showAlert('error', error);
	}
};