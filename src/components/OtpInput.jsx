import React, { useState } from 'react';

const OtpInput = ({ length = 6, handleOtpSubmit }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));

  const handleChange = (value, index) => {
    if (/^[0-9]*$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Automatically move to the next input if a digit is entered
      if (value && index < length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData('text')
      .slice(0, length)
      .split('');
    const updatedOtp = otp.map((_, i) => pasteData[i] || '');
    setOtp(updatedOtp);
    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex < length) {
      document.getElementById(`otp-input-${lastFilledIndex}`).focus();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === length) {
      handleOtpSubmit({ otp: otpValue }); // Pass OTP to the parent handler
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={e => handleChange(e.target.value, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center text-lg font-medium rounded-md shadow-sm outline-none transition-all text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border ${
              digit === '' ? 'border-gray-300' : 'border-blue-500'
            }`}
            autoComplete="off"
          />
        ))}
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-2 px-6 text-sm font-bold rounded-md outline-none bg-blue-600 text-white hover:bg-blue-700 focus:outline-none shadow-md"
        >
          Verify OTP
        </button>
      </div>
    </form>
  );
};

export default OtpInput;
