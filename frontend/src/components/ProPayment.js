import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

function ProPayment() {
  const handleToken = (token) => {
    axios.post('http://127.0.0.1:5000/stripe-webhook', {
      token: token.id,
    }).then((response) => {
      alert('Pro license activated!');
    }).catch((error) => {
      alert('Payment failed.');
    });
  };
//
//
// have to see this
//
//
  return (
    <StripeCheckout
      stripeKey="your-publishable-stripe-key"
      token={handleToken}
      amount={1000} 
      name="Pro License"
    />
  );
}

export default ProPayment;
