import React from 'react';
import { useForm } from 'react-hook-form';

const AllocateServiceRequest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    console.log('Service Request Data:', data);
    // Handle form submission logic here
  };

  return (
    <div className=" mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Allocate Service Request</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Service Request ID */}
        <div className="mb-4">
          <label
            htmlFor="serviceRequestId"
            className="block text-sm font-semibold mb-2"
          >
            Service Request ID
          </label>
          <input
            type="number"
            id="serviceRequestId"
            {...register('serviceRequestId', {
              required: 'Service Request ID is required',
            })}
            className={`border rounded-md p-2 w-full ${
              errors.serviceRequestId ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.serviceRequestId && (
            <p className="text-red-500 text-sm">
              {errors.serviceRequestId.message}
            </p>
          )}
        </div>

        {/* Quotation No */}
        <div className="mb-4">
          <label
            htmlFor="quotationNo"
            className="block text-sm font-semibold mb-2"
          >
            Quotation No
          </label>
          <input
            type="text"
            id="quotationNo"
            {...register('quotationNo', {
              required: 'Quotation No is required',
            })}
            className={`border rounded-md p-2 w-full ${
              errors.quotationNo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.quotationNo && (
            <p className="text-red-500 text-sm">{errors.quotationNo.message}</p>
          )}
        </div>

        {/* Industry */}
        <div className="mb-4">
          <label
            htmlFor="industry"
            className="block text-sm font-semibold mb-2"
          >
            Industry
          </label>
          <input
            type="text"
            id="industry"
            {...register('industry', { required: 'Industry is required' })}
            className={`border rounded-md p-2 w-full ${
              errors.industry ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.industry && (
            <p className="text-red-500 text-sm">{errors.industry.message}</p>
          )}
        </div>

        {/* Zone */}
        <div className="mb-4">
          <label htmlFor="zone" className="block text-sm font-semibold mb-2">
            Zone
          </label>
          <input
            type="text"
            id="zone"
            {...register('zone', { required: 'Zone is required' })}
            className={`border rounded-md p-2 w-full ${
              errors.zone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.zone && (
            <p className="text-red-500 text-sm">{errors.zone.message}</p>
          )}
        </div>

        {/* Equipment Serial No */}
        <div className="mb-4">
          <label
            htmlFor="equipmentSerialNo"
            className="block text-sm font-semibold mb-2"
          >
            Equipment Serial No
          </label>
          <input
            type="text"
            id="equipmentSerialNo"
            {...register('equipmentSerialNo', {
              required: 'Equipment Serial No is required',
            })}
            className={`border rounded-md p-2 w-full ${
              errors.equipmentSerialNo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.equipmentSerialNo && (
            <p className="text-red-500 text-sm">
              {errors.equipmentSerialNo.message}
            </p>
          )}
        </div>

        {/* Customer Name */}
        <div className="mb-4">
          <label
            htmlFor="customerName"
            className="block text-sm font-semibold mb-2"
          >
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            {...register('customerName', {
              required: 'Customer Name is required',
            })}
            className={`border rounded-md p-2 w-full ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">
              {errors.customerName.message}
            </p>
          )}
        </div>

        {/* Billing Plant */}
        <div className="mb-4">
          <label
            htmlFor="billingPlant"
            className="block text-sm font-semibold mb-2"
          >
            Billing Plant
          </label>
          <input
            type="text"
            id="billingPlant"
            {...register('billingPlant', {
              required: 'Billing Plant is required',
            })}
            className={`border rounded-md p-2 w-full ${
              errors.billingPlant ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.billingPlant && (
            <p className="text-red-500 text-sm">
              {errors.billingPlant.message}
            </p>
          )}
        </div>

        {/* Sales User On Behalf Of */}
        <div className="mb-4">
          <label
            htmlFor="salesUserOnBehalfOf"
            className="block text-sm font-semibold mb-2"
          >
            Sales User On Behalf Of
          </label>
          <input
            type="text"
            id="salesUserOnBehalfOf"
            {...register('salesUserOnBehalfOf')}
            className="border rounded-md p-2 w-full border-gray-300"
          />
        </div>

        {/* Remarks */}
        <div className="mb-4 col-span-1 md:col-span-2">
          <label htmlFor="remarks" className="block text-sm font-semibold mb-2">
            Remarks
          </label>
          <textarea
            id="remarks"
            {...register('remarks')}
            className="border rounded-md p-2 w-full border-gray-300"
          />
        </div>

        {/* Attachments */}
        <div className="mb-4 col-span-1 md:col-span-2">
          <label
            htmlFor="attachments"
            className="block text-sm font-semibold mb-2"
          >
            Attachments
          </label>
          <input
            type="file"
            id="attachments"
            {...register('attachments')}
            className="border rounded-md p-2 w-full border-gray-300"
          />
        </div>

        {/* Allocated To */}
        <div className="mb-4">
          <label
            htmlFor="allocatedTo"
            className="block text-sm font-semibold mb-2"
          >
            Allocated To
          </label>
          <input
            type="text"
            id="allocatedTo"
            {...register('allocatedTo', {
              required: 'Allocated To is required',
            })}
            className={`border rounded-md p-2 w-full ${
              errors.allocatedTo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.allocatedTo && (
            <p className="text-red-500 text-sm">{errors.allocatedTo.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Allocate Service Request
        </button>
      </form>
    </div>
  );
};

export default AllocateServiceRequest;
