import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../features/authSlice';
import { MdClose } from 'react-icons/md';
import { fetchUsers } from '../features/authSlice';

const CreateUser = () => {
  const dispatch = useDispatch();
  const [selectedRoles, setSelectedRoles] = useState([]);
  console.log('🚀 ~ CreateUser ~ selectedRoles:', selectedRoles);
  const { users, loading } = useSelector(state => state.auth);
  console.log('🚀 ~ CreateUser ~ users:', users);
  const [emailError, setEmailError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const email = watch('email'); // Watch the email input value

  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (email && users.length > 0) {
      // Check if the email already exists in the fetched users
      const isEmailTaken = users.some(user => user.email === email);
      setEmailError(isEmailTaken ? 'Email is already used' : '');
    } else {
      setEmailError('');
    }
  }, [email, users]); // Dependency on `email` and `users`

  const onSubmit = data => {
    if (emailError) return; // Prevent submission if email exists
    const payload = { ...data, role: selectedRoles[0] };
    dispatch(createUser(payload))
      .unwrap()
      .then(() => {
        reset();
        setSelectedRoles([]);
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  };

  const handleRoleChange = e => {
    const { value } = e.target;
    if (value && !selectedRoles.includes(value)) {
      setSelectedRoles(prev => [...prev, value]);
    }
  };

  const removeRole = role => {
    setSelectedRoles(prev => prev.filter(r => r !== role));
  };

  return (
    <div className="mx-auto py-6 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-400 shadow-sm rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Employee Form</h2>

      {/* Selected Roles Display */}
      <div className="mb-4 flex justify-start items-center gap-1">
        {selectedRoles.length > 0 && (
          <h3 className="text-lg font-medium ">Selected Roles: </h3>
        )}
        <div className="flex flex-wrap gap-1">
          {selectedRoles.map((role, index) => (
            <span
              key={index}
              className="bg-brandYellow text-white py-1 px-3 rounded-full text-sm flex items-center gap-1"
            >
              {role}
              <button
                type="button"
                className="text-white ml-2 hover:text-red-500"
                onClick={() => removeRole(role)}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div className="mb-4">
          <label
            htmlFor="employeeId"
            className="block text-sm font-semibold mb-2"
          >
            Employee ID
          </label>
          <input
            type="text"
            id="employeeId"
            {...register('employeeId', { required: 'Employee ID is required' })}
            className={`border rounded-md dark:bg-gray-600 dark:text-gray-300 outline-none p-1 w-full text-sm ${
              errors.employeeId ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="off"
          />
          {errors.employeeId && (
            <p className="text-red-500 text-sm">{errors.employeeId.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="fullName"
            {...register('fullName', { required: 'Name is required' })}
            className={`border rounded-md dark:bg-gray-600 dark:text-gray-300 outline-none p-1 w-full text-sm ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="off"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format',
              },
            })}
            className={`border rounded-md dark:bg-gray-600 dark:text-gray-300 outline-none p-1 w-full text-sm ${
              errors.email || emailError ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="off"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-semibold mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^\+?[0-9]{10,15}$/,
                message: 'Invalid phone number',
              },
            })}
            className={`border rounded-md dark:bg-gray-600 dark:text-gray-300 outline-none p-1 w-full text-sm ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="off"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-semibold mb-2">
            Roles
          </label>
          <select
            id="role"
            onChange={handleRoleChange}
            className={`border rounded-md dark:bg-gray-600 dark:text-gray-300 outline-none p-1 w-full text-sm ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="off"
          >
            <option value="">Select a role</option>
            <option value="salesUser">Sales User</option>
            <option value="billingManager">Billing Manager</option>
            <option value="billingAgent">Billing Agent</option>
            <option value="manager">C&LManager</option>
            <option value="inspector">Inspector</option>
          </select>
        </div>

        <button
          type="submit"
          className="h-9 mt-6 bg-brandYellow text-white py-2 rounded-md hover:shadow-md transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
