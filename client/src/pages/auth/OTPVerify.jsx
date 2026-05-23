import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';

const OTPVerify = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      toast.error('Session expired. Please register again.');
      navigate(ROUTES.PUBLIC.REGISTER);
    }
  }, [location, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Ensure only numbers

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus the next empty input or the last one
    const focusIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${focusIndex}`).focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = code.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOtp({ email, code: otpCode, type: 'email_verify' });
      if (response.success) {
        toast.success('Email verified! You can now sign in.');
        navigate(ROUTES.PUBLIC.LOGIN);
      }
    } catch (err) {
      toast.error(err || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email, type: 'email_verify' });
      toast.success('New OTP sent to your email');
    } catch (err) {
      toast.error(err || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
        <div className="flex justify-center">
          <div className="bg-doctor-light p-4 rounded-full">
            <ShieldCheck className="h-10 w-10 text-doctor" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
          <p className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-1">
            <Mail className="h-4 w-4" /> Code sent to <span className="font-semibold">{email}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-doctor focus:outline-none transition-all"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button 
              type="button" 
              onClick={handleResend}
              className="text-doctor font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </p>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-doctor hover:bg-doctor-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-doctor disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;
