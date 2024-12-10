import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-5 md:mb-10">
        <Link to="/" className="head-font  text-3xl md:text-5xl underline">
          PDI
        </Link>
        <h4 className="text-gray-800 text-xl font-semibold mt-2 md:mt-6">
          Forgot Password
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          Enter your registered email to reset your password
        </p>
      </div>

      <form>
        <div className="flex flex-col gap-8">
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
            <input
              name="email"
              type="email"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter your registered email"
            />
          </div>
        </div>

        <div className="mt-12">
          <button
            type="button"
            className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Send Reset Link
          </button>
        </div>
      </form>

      {/* Back to login link */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-700">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
