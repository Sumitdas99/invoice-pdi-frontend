import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-5 md:mb-10">
        <Link to="/" className="head-font text-3xl md:text-5xl underline">
          PDI
        </Link>
        <h4 className="text-gray-800 text-xl font-semibold mt-2 md:mt-6">
          Reset Password
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          Enter your new password below
        </p>
      </div>

      <form>
        <div className="flex flex-col gap-8">
          {/* New Password Input */}
          <div>
            <label className="text-gray-800 text-sm mb-2 block">
              New Password
            </label>
            <input
              name="new-password"
              type="password"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password Input */}
          <div>
            <label className="text-gray-800 text-sm mb-2 block">
              Confirm New Password
            </label>
            <input
              name="confirm-password"
              type="password"
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="mt-12">
          <button
            type="button"
            className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Reset Password
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

export default ResetPassword;
