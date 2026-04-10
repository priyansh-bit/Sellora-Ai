export const loadRazorpay = (amount: number, currency: string = 'INR', description: string = 'Sellora Subscription') => {
  return new Promise((resolve) => {
    const options = {
      key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: amount * 100, // Amount in paise
      currency: currency,
      name: 'Sellora Technologies',
      description: description,
      image: 'https://sellora.com/logo.png',
      handler: function (response: any) {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });
      },
      prefill: {
        name: 'Sellora User',
        email: 'user@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Sellora Corporate Office'
      },
      theme: {
        color: '#2563eb'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  });
};
