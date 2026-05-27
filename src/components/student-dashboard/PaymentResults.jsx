import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentResult = () => {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const status     = params.get('status');   // success | pending | failed | error
  const txRef      = params.get('tx_ref');
  const resourceId = params.get('resourceId');

  useEffect(() => {
    const target = '/books/premium';
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          navigate(target);
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, status]);

  const config = {
    success: {
      icon: '✅',
      title: 'Payment Successful!',
      message: 'Your book has been unlocked. You can now read and download it.',
      color: '#2ea043',
      bg: '#1a3a2a',
      border: '#2ea043',
    },
    pending: {
      icon: '⏳',
      title: 'Payment Pending',
      message: 'Your payment is still being processed. Check back in a moment — your book will unlock automatically once confirmed.',
      color: '#e3a525',
      bg: '#3a2a1a',
      border: '#e3a525',
    },
    failed: {
      icon: '❌',
      title: 'Payment Failed or Cancelled',
      message: 'Your payment was not completed. No charges were made. You can try again anytime.',
      color: '#f85149',
      bg: '#3d1a1a',
      border: '#f85149',
    },
    error: {
      icon: '⚠️',
      title: 'Something Went Wrong',
      message: 'We could not process your payment result. Please contact support if you were charged.',
      color: '#f85149',
      bg: '#3d1a1a',
      border: '#f85149',
    },
  };

  const ui = config[status] ?? config.error;

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6">
      <div
        className="w-full max-w-md rounded-xl p-8 text-center"
        style={{ backgroundColor: ui.bg, border: `1px solid ${ui.border}` }}
      >
        <div className="text-6xl mb-4">{ui.icon}</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: ui.color }}>
          {ui.title}
        </h1>
        <p className="text-[#8b949e] text-sm mb-6">{ui.message}</p>

        {txRef && (
          <p className="text-xs text-[#6e7681] mb-6">
            Transaction ref:{' '}
            <span className="text-[#e6edf3] font-mono">{txRef}</span>
          </p>
        )}

        <p className="text-xs text-[#6e7681] mb-4">
          Redirecting to books in{' '}
          <span style={{ color: ui.color }}>{countdown}s</span>…
        </p>

        <button
          onClick={() => navigate('/books/premium')}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition"
          style={{ backgroundColor: ui.color }}
        >
          Go to Books Now
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;