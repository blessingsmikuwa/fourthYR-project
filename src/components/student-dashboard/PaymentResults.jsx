import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const status     = searchParams.get('status');
  const txRef      = searchParams.get('tx_ref');
  const resourceId = searchParams.get('resourceId');

  const [verifying, setVerifying]   = useState(status === 'success');
  const [finalStatus, setFinalStatus] = useState(status);

  useEffect(() => {
    if (status !== 'success' || !txRef) {
      setVerifying(false);
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!resourceId || !token) {
      setFinalStatus('success');
      setVerifying(false);
      return;
    }
    fetch(`${API_BASE}/payment/has-access?resourceId=${resourceId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(r => r.json())
      .then(d => setFinalStatus(d.hasAccess ? 'success' : 'pending'))
      .catch(() => setFinalStatus('success'))
      .finally(() => setVerifying(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const config = {
    success: {
      icon: '🎉',
      title: 'Payment Successful!',
      message: 'Your purchase is confirmed. You can now read and download the book.',
      color: '#2ea043',
      bg: '#1a3a2a',
      border: '#2ea043',
      primaryLabel: 'Go to My Books',
      primaryPath: '/books/premium',
      secondaryLabel: null,
    },
    pending: {
      icon: '⏳',
      title: 'Payment Pending',
      message: 'Your payment is being processed. The book will unlock automatically once confirmed — usually within a few minutes.',
      color: '#e3a525',
      bg: '#3a2a1a',
      border: '#e3a525',
      primaryLabel: 'Go to My Books',
      primaryPath: '/books/premium',
      secondaryLabel: 'Back to Home',
      secondaryPath: '/',
    },
    failed: {
      icon: '❌',
      title: 'Payment Failed',
      message: 'Your payment did not go through. No charges were made.',
      color: '#f85149',
      bg: '#3d1a1a',
      border: '#f85149',
      primaryLabel: 'Try Again',
      primaryPath: '/books/premium',
      secondaryLabel: 'Back to Home',
      secondaryPath: '/',
    },
    error: {
      icon: '⚠️',
      title: 'Something Went Wrong',
      message: 'We could not confirm your payment. Please contact support if you were charged.',
      color: '#f85149',
      bg: '#3d1a1a',
      border: '#f85149',
      primaryLabel: 'Back to Home',
      primaryPath: '/',
      secondaryLabel: null,
    },
  };

  const result = config[finalStatus] ?? config.error;

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center text-[#8b949e]">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-sm">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div
          className="rounded-xl p-8 text-center"
          style={{ backgroundColor: result.bg, border: `1px solid ${result.border}` }}
        >
          <div className="text-5xl mb-4">{result.icon}</div>
          <h2 className="text-xl font-bold mb-3" style={{ color: result.color }}>
            {result.title}
          </h2>
          <p className="text-sm text-[#8b949e] mb-6">{result.message}</p>

          {txRef && (
            <p className="text-xs text-[#6e7681] mb-6">
              Reference: <span className="font-mono text-[#e6edf3]">{txRef}</span>
            </p>
          )}

          <button
            onClick={() => { window.location.href = result.primaryPath; }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition mb-3"
            style={{ backgroundColor: result.color }}
          >
            {result.primaryLabel}
          </button>

          {result.secondaryLabel && (
            <button
              onClick={() => { window.location.href = result.secondaryPath; }}
              className="w-full py-2 rounded-lg text-xs text-[#8b949e] border border-[#21262d] hover:border-[#6e7681] transition"
            >
              {result.secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}