import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import ProPayment from '../components/ProPayment';
import { ProContext } from '../context/ProContext';

const ProPage = () => {
  const { isPro } = useContext(ProContext);

  return (
    <div>
      <Navbar />
      <h1>Pro Features</h1>
      {isPro ? (
        <p>Thank you for upgrading to Pro! Enjoy uploading images to your To-Dos.</p>
      ) : (
        <>
          <p>Upgrade to Pro to unlock premium features like image uploads.</p>
          <ProPayment />
        </>
      )}
    </div>
  );
};

export default ProPage;
