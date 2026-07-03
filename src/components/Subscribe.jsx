import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, CreditCard, ShieldCheck, Sparkles, Users } from 'lucide-react';
import './Subscribe.css';
import RazorpayCheckout from './RazorpayCheckout';
import API, { getFriendlyApiErrorMessage } from './Api';
import heroImage from '../assets/workout-hero.jpg';

const Subscribe = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [showTerms, setShowTerms] = useState(false);
  const [autoPayment, setAutoPayment] = useState(null);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [confirmButtonState, setConfirmButtonState] = useState('default'); // 'default', 'loading', 'success'
  const [savingPreference, setSavingPreference] = useState(false);
  const [trialStatus, setTrialStatus] = useState(null);
  const [pageMessage, setPageMessage] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data } = await API.get('/api/accounts/gym-subscription/');
        if (data?.plan === 'trial') {
          setTrialStatus(data);
        } else if (data && data.is_active) {
          navigate('/profile');
        }
      } catch (error) {
        // No subscription is fine.
      }
    };
    checkSubscription();
  }, [navigate]);

  const membershipTiers = useMemo(() => [
    {
      id: 'monthly',
      name: 'Monthly Power',
      price: '₹1,499',
      duration: 'per month',
      summary: 'Flexible access for a focused training month.',
      Icon: CalendarDays,
      features: ['Full gym access', 'Starter training plans', 'Locker and support desk access'],
    },
    {
      id: 'quarterly',
      name: 'Quarterly Beast',
      price: '₹3,999',
      duration: 'for 3 months',
      summary: 'Best value for steady strength and body composition progress.',
      Icon: Sparkles,
      features: ['Everything in Monthly', 'Custom nutrition plan', 'Premium classes and progress reviews'],
      isPopular: true,
    },
    {
      id: 'annual',
      name: 'Annual Iron',
      price: '₹13,999',
      duration: 'per year',
      summary: 'A complete membership for serious long-term transformation.',
      Icon: BadgeCheck,
      features: ['Everything in Quarterly', '1-on-1 coaching check-ins', 'RedIron member kit'],
    },
  ], []);

  const selectedTier = membershipTiers.find((tier) => tier.id === selectedPlan) || membershipTiers[1];

  const savePaymentPreference = async (value) => {
    setSavingPreference(true);
    try {

      await API.post('/api/accounts/user/payment-option/', { auto_payment: value });
      return true;
    } catch (error) {
      console.error('Failed to inform backend about payment option:', error);
      return false;
    } finally {
      setSavingPreference(false);
    }
  };

  const handleSubscribeClick = async () => {
    const saved = await savePaymentPreference(true);
    if (saved) {
      setShowRazorpay(true);
      setShowTerms(false);
    }
  };

  const handleFreeTrialClick = () => {
    if (trialStatus?.trial_used) {
      setPageMessage({ type: 'error', text: 'Free trial already used. Please purchase a membership plan.' });
      return;
    }
    setShowTerms(true);
    setAutoPayment(null);
    setShowRazorpay(false);
    setPageMessage(null);
  };

  const handleTermsOk = async () => {
    if (autoPayment === null) {
      setPageMessage({ type: 'error', text: 'Please select a payment preference.' });
      return;
    }

    setConfirmButtonState('loading');
    try {
      const response = await API.post('/api/accounts/start-trial/', {
        renewal_preference: autoPayment ? 'auto' : 'manual',
        plan_id: selectedPlan,
      });

      setTrialStatus({
        ...(response.data.trial || {}),
        plan: 'trial',
        is_active: true,
        trial_used: true,
      });
      setConfirmButtonState('success');
      setTimeout(() => {
        setShowCongratsPopup(true);
        setShowTerms(false);
        setConfirmButtonState('default');
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || getFriendlyApiErrorMessage(error, 'There was an issue starting your trial. Please try again.');
      console.error('Failed to start trial:', errorMessage);
      if (error.response?.data?.trial) {
        setTrialStatus({ ...(error.response.data.trial || {}), plan: 'trial', trial_used: true });
      }
      setPageMessage({ type: 'error', text: errorMessage });
      setConfirmButtonState('default');
    }
  };

  return (
    <main className="subscribe-page">
      <section className="subscribe-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="subscribe-heroOverlay" />
        <div className="subscribe-shell">
          <button className="subscribe-back" type="button" onClick={() => navigate('/')} aria-label="Back to home">
            <ArrowLeft size={20} />
          </button>

          <div className="subscribe-heroContent">
            <span className="subscribe-kicker"><ShieldCheck size={17} /> RedIron Membership</span>
            <h1>Train stronger with a plan that fits your life.</h1>
<p>Start your <strong>15-day free trial</strong> — then manage gym access, coaching, and nutrition from your profile.</p>
            <div className="subscribe-heroActions">
              <button className="subscribe-primary" type="button" onClick={handleFreeTrialClick}>
                Start 15-Day Trial
              </button>
              <button className="subscribe-secondary" type="button" onClick={handleSubscribeClick} disabled={savingPreference}>
                <CreditCard size={18} /> {savingPreference ? 'Preparing...' : `Pay ${selectedTier.price}`}
              </button>
            </div>
            {trialStatus?.plan === 'trial' && (
              <div className={`subscribe-status ${trialStatus.is_active ? 'active' : 'expired'}`}>
                <strong>{trialStatus.is_active ? 'Trial Active' : 'Trial expired.'}</strong>
                {trialStatus.is_active ? (
                  <span>{trialStatus.days_remaining} days remaining. Expires {new Date(trialStatus.trial_end_date || trialStatus.end_date).toLocaleDateString()}.</span>
                ) : (
                  <span>Choose a membership plan to continue training.</span>
                )}
              </div>
            )}
            {pageMessage && (
              <div className={`subscribe-message ${pageMessage.type}`}>
                {pageMessage.text}
              </div>
            )}
          </div>

          <div className="subscribe-plans" aria-label="Membership plans">
            {membershipTiers.map((tier) => {
              const Icon = tier.Icon;
              const active = selectedPlan === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  className={`subscribe-plan ${active ? 'active' : ''} ${tier.isPopular ? 'popular' : ''}`}
                  onClick={() => setSelectedPlan(tier.id)}
                >
                  {tier.isPopular && <span className="subscribe-badge">Most Popular</span>}
                  <span className="subscribe-planIcon"><Icon size={22} /></span>
                  <span className="subscribe-planName">{tier.name}</span>
                  <div className="subscribe-planPriceWrap">
                    <span className="subscribe-planPrice">{tier.price}</span>
                    <span className="subscribe-planDuration">{tier.duration}</span>
                  </div>
                  <span className="subscribe-planSummary">{tier.summary}</span>
                  <span className="subscribe-featureList">
                    {tier.features.map((feature) => (
                      <span key={feature}><CheckCircle2 size={16} /> {feature}</span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="subscribe-trust">
            <span><Users size={17} /> Member-first support</span>
            <span><ShieldCheck size={17} /> Secure payment preference</span>
            <span><CheckCircle2 size={17} /> Cancel or renew from profile</span>
          </div>

          {showTerms && (
            <section className="subscribe-terms" aria-live="polite">
              <div>
                <h2>Trial Payment Preference</h2>
                <p>Select how billing should work after your free trial ends.</p>
              </div>
              <label>
                <input type="radio" name="paymentOption" checked={autoPayment === true} onChange={() => setAutoPayment(true)} />
                <span>Auto-renew after trial</span>
              </label>
              <label>
                <input type="radio" name="paymentOption" checked={autoPayment === false} onChange={() => setAutoPayment(false)} />
                <span>Manual renewal only</span>
              </label>
              <button
                className={`subscribe-primary compact subscribe-confirm-btn ${confirmButtonState}`}
                type="button"
                onClick={handleTermsOk}
                disabled={autoPayment === null || confirmButtonState !== 'default'}
              >
                {confirmButtonState === 'loading' && 'Confirming...'}
                {confirmButtonState === 'success' && 'Trial Activated!'}
                {confirmButtonState === 'default' && 'Confirm Trial'}
              </button>
            </section>
          )}

          {showRazorpay && (
            <div className="subscribe-checkout">
              <RazorpayCheckout plan={selectedTier.id} />
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showCongratsPopup && (
          <motion.div className="subscribe-popup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="subscribe-popupCard" initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}>
              <CheckCircle2 size={42} />
              <h2>Trial Started</h2>
              <p>Your free 15-day trial is enabled. ✅
                We’ll email you your trial access steps, and your auto-renewal preference is saved.
              </p>
              <button type="button" onClick={() => { setShowCongratsPopup(false); navigate('/'); }}>OK</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Subscribe;
