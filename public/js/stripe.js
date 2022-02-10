/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js';


export const BookTravel = async travelId => {
  try {
		// get checkout session from endpoint
		const session = await axios(
			`/api/v1/bookings/checkout-stripe/${travelId}`
		)
		//console.log(session)
		const stripe = await loadStripe('pk_test_51KOktUA1H3VpG3RzpJaw3scJ5F8EoaqeITHyjhQf5I9HKICdXef672PeVTZ3UuE9hyiCYSRbV0UyLeYlM6sSha9M002uPlCVpg');
		// redirect to checkout
		await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
		

	} catch (error) {
		// console.log(error);
    	showAlert('error', error);
	}
}