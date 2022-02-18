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
    const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
    // redirect to checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    showAlert('error', error);
  }
}
