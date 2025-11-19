
import React from 'react';
import Layout from '../components/Layout';
import OrderHistory from '../components/OrderHistory';

const OrderHistoryPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center text-farm-green-dark mb-8">
          Your Order History
        </h1>
        <div className="max-w-4xl mx-auto">
          <OrderHistory />
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistoryPage;
