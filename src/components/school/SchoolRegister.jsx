import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';


// ─── CONFIG — change LOGIN_PATH to match your actual route ──────────────────
const LOGIN_PATH  = '/Login';          // ← FIX THIS to your real login route
const API_BASE    = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const PAYCHANGU_API = 'https://api.paychangu.com/payment';

// ── tiny reusable field wrapper ──────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-medium text-[#8b949e] uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-[#f85149]">*</span>}
    </label>
    {children}
    {error && <p className="text-[#f85149] text-xs mt-1">{error}</p>}
  </div>
);

const inputCls =
  'w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ea043] placeholder-[#6e7681] transition';

// ────────────────────────────────────────────────────────────────────────────

export default function SchoolRegister() {
  const [searchParams] = useSearchParams();

  // Query params set by PayChangu redirect
  const urlStep       = searchParams.get('step');
  const urlStatus     = searchParams.get('status');   // success | failed | pending | error
  const urlTxRef      = searchParams.get('tx_ref');
  const urlSchoolName = searchParams.get('school') ?? '';  // passed through callback_url

  // Step: jump straight to result page if PayChangu redirected back
  const [step, setStep]         = useState(urlStep === 'result' ? 3 : 1);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [fee, setFee]           = useState(null);
  const [schoolId, setSchoolId] = useState(null);

  // Step 1 — school details
  const [details, setDetails]           = useState({ name: '', location: '', phone: '' });
  const [detailErrors, setDetailErrors] = useState({});

  // Step 2 — contact email
  const [email, setEmail]         = useState('');
  const [emailError, setEmailError] = useState('');

  // ── Fetch registration fee on mount ─────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/school/registration-fee`)
      .then((r) => r.json())
      .then((d) => setFee(d))
      .catch(() => {});
  }, []);

  // ── Step 1: validate + save school to DB ─────────────────────────────────────
  const validateDetails = () => {
    const errs = {};
    if (!details.name.trim())     errs.name     = 'School name is required';
    if (!details.location.trim()) errs.location = 'Location is required';
    if (!details.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\+?\d{7,15}$/.test(details.phone.replace(/\s/g, ''))) {
      errs.phone = 'Enter a valid phone number';
    }
    setDetailErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!validateDetails()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/school/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.message ?? 'Registration failed');
      }
      const school = await res.json();
      setSchoolId(school.id);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: get payload from backend, then POST to PayChangu from the browser ─
  const validateEmail = () => {
    if (!email.trim())                { setEmailError('Email is required');   return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Enter a valid email'); return false; }
    setEmailError('');
    return true;
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Ask backend to create txRef in DB and return signed payload + secretKey.
      //    Backend does NOT call PayChangu (Render blocks outbound TCP).
      const backendRes = await fetch(`${API_BASE}/school/${schoolId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!backendRes.ok) {
        const d = await backendRes.json().catch(() => ({}));
        throw new Error(d?.message ?? 'Could not prepare payment');
      }

      const { secretKey, payload } = await backendRes.json();

      if (!secretKey || !payload) {
        throw new Error('Invalid response from server');
      }

      // 2. Browser calls PayChangu directly — no Render restriction here.
      const pcRes = await fetch(PAYCHANGU_API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await pcRes.json();

      if (data?.status === 'success' && data?.data?.checkout_url) {
        // 3. Hand off to the PayChangu checkout page.
        window.location.href = data.data.checkout_url;
      } else {
        throw new Error(data?.message ?? 'PayChangu did not return a checkout URL');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Result page config ───────────────────────────────────────────────────────
  //    All action.path values use window.location.href (set below) so React
  //    Router's stale history doesn't cause a blank page after the redirect loop.
  const schoolLabel = urlSchoolName || details.name || 'Your school';

  const resultConfig = {
    success: {
      icon: '🎉',
      title: 'Registration Complete!',
      message: `${schoolLabel} has been successfully registered and activated. You can now log in and start using the platform.`,
      color: '#2ea043', bg: '#1a3a2a', border: '#2ea043',
      action: { label: 'Go to Login', path: "/" },
    },
    pending: {
      icon: '⏳',
      title: 'Payment Pending',
      message: 'Your payment is being processed. Your school will be activated automatically once confirmed — this usually takes a few minutes.',
      color: '#e3a525', bg: '#3a2a1a', border: '#e3a525',
      action: { label: 'Back to Home', path: '/' },
    },
    failed: {
      icon: '❌',
      title: 'Payment Failed',
      message: 'Your payment did not go through. No charges were made. Please try again.',
      color: '#f85149', bg: '#3d1a1a', border: '#f85149',
      action: { label: 'Try Again', path: '/school/register' },
    },
    error: {
      icon: '⚠️',
      title: 'Something Went Wrong',
      message: 'We could not confirm your payment. Please contact support if you were charged.',
      color: '#f85149', bg: '#3d1a1a', border: '#f85149',
      action: { label: 'Back to Home', path: '/' },
    },
  };

  const result = resultConfig[urlStatus] ?? resultConfig.error;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏫</div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">School Registration</h1>
          <p className="text-sm text-[#8b949e] mt-1">
            Register your school to access the online library platform
          </p>
        </div>

        {/* Step indicator — steps 1 and 2 only */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-3 mb-8">
            {[
              { n: 1, label: 'School Details' },
              { n: 2, label: 'Payment'        },
            ].map(({ n, label }, i) => (
              <React.Fragment key={n}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      step === n
                        ? 'bg-[#2ea043] text-white'
                        : step > n
                        ? 'bg-[#2ea04360] text-[#2ea043]'
                        : 'bg-[#21262d] text-[#6e7681]'
                    }`}
                  >
                    {step > n ? '✓' : n}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      step === n ? 'text-[#e6edf3]' : 'text-[#6e7681]'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i === 0 && (
                  <div
                    className={`flex-1 h-px max-w-[60px] ${
                      step > 1 ? 'bg-[#2ea043]' : 'bg-[#21262d]'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* ── Step 1: School Details ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#e6edf3] mb-5">School Information</h2>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-[#3d1f1f] border border-[#f85149] text-[#f85149] text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <Field label="School Name" required error={detailErrors.name}>
                <input
                  type="text"
                  value={details.name}
                  onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Kamuzu Academy"
                  className={inputCls}
                  disabled={loading}
                />
              </Field>

              <Field label="Location" required error={detailErrors.location}>
                <input
                  type="text"
                  value={details.location}
                  onChange={(e) => setDetails((d) => ({ ...d, location: e.target.value }))}
                  placeholder="e.g. Lilongwe, Malawi"
                  className={inputCls}
                  disabled={loading}
                />
              </Field>

              <Field label="Phone Number" required error={detailErrors.phone}>
                <input
                  type="tel"
                  value={details.phone}
                  onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                  placeholder="e.g. +265 999 000 000"
                  className={inputCls}
                  disabled={loading}
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2ea043] hover:bg-[#3fb950] text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50 mt-2"
              >
                {loading ? 'Saving…' : 'Continue to Payment →'}
              </button>
            </form>

            <p className="text-center text-xs text-[#6e7681] mt-4">
              Already registered?{' '}
              <button
                onClick={() => { window.location.href = LOGIN_PATH; }}
                className="text-[#2ea043] hover:underline"
              >
                Log in here
              </button>
            </p>
          </div>
        )}

        {/* ── Step 2: Payment ────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#e6edf3] mb-1">Registration Fee</h2>
            <p className="text-xs text-[#8b949e] mb-5">
              A one-time registration fee is required to activate your school account.
            </p>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-[#3d1f1f] border border-[#f85149] text-[#f85149] text-xs">
                {error}
              </div>
            )}

            {/* Fee summary card */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#8b949e]">School</span>
                <span className="text-sm text-[#e6edf3] font-medium">{details.name}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#8b949e]">Location</span>
                <span className="text-sm text-[#e6edf3]">{details.location}</span>
              </div>
              <div className="border-t border-[#21262d] my-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#e6edf3]">Registration Fee</span>
                <span className="text-lg font-bold text-[#2ea043]">
                  {fee ? `MWK ${fee.amount.toLocaleString()}` : 'Loading…'}
                </span>
              </div>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <Field label="Contact Email" required error={emailError}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourschool.com"
                  className={inputCls}
                  disabled={loading}
                />
                <p className="text-[11px] text-[#6e7681] mt-1">
                  The payment receipt will be sent to this address.
                </p>
              </Field>

              <button
                type="submit"
                disabled={loading || !fee}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {loading
                  ? 'Connecting to payment gateway…'
                  : fee
                  ? `💳 Pay MWK ${fee.amount.toLocaleString()}`
                  : 'Loading…'}
              </button>
            </form>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 text-xs text-[#6e7681] hover:text-[#e6edf3] transition"
            >
              ← Back to school details
            </button>

            {/* Test mode notice */}
            <div className="mt-4 px-3 py-2 rounded-lg bg-[#1a2a3a] border border-[#388bfd] text-[#388bfd] text-xs">
              🧪 <strong>Test mode:</strong> Use card{' '}
              <span className="font-mono">4242 4242 4242 4242</span>, expiry{' '}
              <span className="font-mono">12/30</span>, CVC{' '}
              <span className="font-mono">123</span>, OTP{' '}
              <span className="font-mono">1234</span>
            </div>
          </div>
        )}

        {/* ── Step 3: Result ──────────────────────────────────────────────────── */}
        {step === 3 && (
          <div
            className="rounded-xl p-8 text-center"
            style={{ backgroundColor: result.bg, border: `1px solid ${result.border}` }}
          >
            <div className="text-5xl mb-4">{result.icon}</div>
            <h2 className="text-xl font-bold mb-3" style={{ color: result.color }}>
              {result.title}
            </h2>
            <p className="text-sm text-[#8b949e] mb-6">{result.message}</p>

            {urlTxRef && (
              <p className="text-xs text-[#6e7681] mb-6">
                Reference:{' '}
                <span className="font-mono text-[#e6edf3]">{urlTxRef}</span>
              </p>
            )}

            {/* ✅ FIX: window.location.href instead of navigate() */}
            <button
              onClick={() => { window.location.href = result.action.path; }}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition"
              style={{ backgroundColor: result.color }}
            >
              {result.action.label}
            </button>

            {urlStatus === 'failed' && (
              <button
                onClick={() => { window.location.href = '/school/register'; }}
                className="w-full mt-3 py-2 rounded-lg text-xs text-[#8b949e] border border-[#21262d] hover:border-[#6e7681] transition"
              >
                Start over
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}