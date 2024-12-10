import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { postToInstance2 } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

// Zod validation schema
const schema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First Name must be at least 2 characters')
      .max(50, 'First Name is too long'),
    lastName: z
      .string()
      .min(2, 'Last Name must be at least 2 characters')
      .max(50, 'Last Name is too long'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^\d+$/, 'Mobile number must contain only digits')
      .min(10, 'Mobile number must be at least 10 digits')
      .max(15, 'Mobile number must not exceed 15 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    cpassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine(data => data.password === data.cpassword, {
    path: ['cpassword'],
    message: 'Passwords do not match',
  });

const Register = () => {
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { cpassword, ...filteredData } = data;
    try {
      const response = await postToInstance2(
        '/api/auth/register',
        filteredData
      );
      if (response && response.status === 200) {
        toast.success(response.data.message);
        reset();
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center bg-cover bg-center ${
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'
      }`}
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-vector/padlock-with-keyhole-icon-personal-data-security-illustrates-cyber-data-information-privacy-idea-blue-color-abstract-hi-speed-internet-technology_542466-600.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 max-w-3xl w-full p-8 bg-white dark:bg-gray-800 md:rounded-md shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
            Invoice
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign up to get started with our platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm mb-2 block font-medium">
                First Name
              </label>
              <input
                {...register('firstName')}
                type="text"
                className={`w-full px-4 py-2 outline-none rounded-md shadow-sm focus:outline-none focus:ring-1 transition-all text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border ${
                  errors.firstName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter first name"
                autoComplete="off"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm mb-2 block font-medium">
                Last Name
              </label>
              <input
                {...register('lastName')}
                type="text"
                className={`w-full px-4 py-2 outline-none rounded-md shadow-sm focus:outline-none focus:ring-1 transition-all text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border ${
                  errors.lastName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter last name"
                autoComplete="off"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm mb-2 block font-medium">Email</label>
              <input
                {...register('email')}
                type="email"
                className={`w-full px-4 py-2 outline-none rounded-md shadow-sm focus:outline-none focus:ring-1 transition-all text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter email"
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm mb-2 block font-medium">
                Mobile Number
              </label>
              <input
                {...register('phone')}
                type="text"
                className={`w-full px-4 py-2 outline-none rounded-md shadow-sm focus:outline-none focus:ring-1 transition-all text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter mobile number"
                autoComplete="off"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm mb-2 block font-medium">Password</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full px-4 py-2 outline-none rounded-md shadow-sm focus:outline-none focus:ring-1 transition-all text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter password"
                autoComplete="off"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm mb-2 block font-medium">
                Confirm Password
              </label>
              <input
                {...register('cpassword')}
                type="password"
                className={`w-full px-4 py-2 outline-none rounded-md shadow-sm focus:outline-none focus:ring-1 transition-all text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border ${
                  errors.cpassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Confirm password"
                autoComplete="off"
              />
              {errors.cpassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cpassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 outline-none px-6 text-sm font-bold rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none shadow-md"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
