import React, { useEffect, useState } from 'react';
import {
  getFromInstance1,
  deleteFromInstance1,
  putToInstance1,
} from '../services/ApiEndpoint'; // Assume `putToInstance1` for update requests
import { MdDelete, MdEdit, MdClose } from 'react-icons/md';
import { AiOutlineCopy } from 'react-icons/ai';
import { fetchUsers } from '../features/authSlice'; // Adjust the path as necessary
import { useDispatch, useSelector } from 'react-redux';

const ShowUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.auth);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'ascending',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedRoles, setUpdatedRoles] = useState([]);
  const [updatedEmployeeId, setUpdatedEmployeeId] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  // Fetch users when the component mounts
  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = e => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCopyEmail = email => {
    navigator.clipboard.writeText(email).then(() => {
      alert('Email copied to clipboard!');
    });
  };

  const handleEditClick = user => {
    setEditingUserId(user._id);
    setUpdatedName(user.fullName || '');
    setUpdatedRoles(Array.isArray(user.role) ? user.role : []);
    setUpdatedEmployeeId(user.employeeId || '');
    setUpdatedEmail(user.email || '');
    setUpdatedPhone(user.phone || '');
  };

  const handleDeleteUser = async userId => {
    try {
      await deleteFromInstance1(`/api/v1/user/${userId}`);
      alert('User deleted successfully.');
      dispatch(fetchUsers());
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleSave = async userId => {
    try {
      await putToInstance1(`/api/v1/user/${userId}`, {
        fullName: updatedName,
        role: updatedRoles,
        employeeId: updatedEmployeeId,
        email: updatedEmail,
        phone: updatedPhone,
      });
      alert('User updated successfully!');
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? {
                ...user,
                fullName: updatedName,
                role: updatedRoles,
                employeeId: updatedEmployeeId,
                email: updatedEmail,
                phone: updatedPhone,
              }
            : user
        )
      );
      setUpdatedRoles([]);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setEditingUserId(null);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setUpdatedRoles([]);
  };

  const handleRoleChange = e => {
    const { value } = e.target;
    if (value && !updatedRoles.includes(value)) {
      setUpdatedRoles(prev => [...prev, value]);
    }
  };

  const removeRole = role => {
    setUpdatedRoles(prev => prev.filter(r => r !== role));
  };

  const sortedUsers = React.useMemo(() => {
    let sortedUsers = [...users];
    if (sortConfig.key) {
      sortedUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortedUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(user => {
    if (user) {
      return (
        (user.fullName &&
          user.fullName.toLowerCase().includes(search.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(search.toLowerCase())) ||
        (user.employeeId &&
          user.employeeId.toLowerCase().includes(search.toLowerCase())) ||
        (user.phone &&
          user.phone.toLowerCase().includes(search.toLowerCase())) ||
        (Array.isArray(user.role) &&
          user.role.some(role =>
            role.toLowerCase().includes(search.toLowerCase())
          ))
      );
    }
    return false; // Return false if user is not valid
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mx-auto py-4 px-2 dark:bg-gray-800 transition-colors text-gray-900 dark:text-gray-400 rounded-lg select-none">
      <h1 className="text-xl font-semibold mb-3">User Lists</h1>
      <div className="my-1 flex flex-wrap gap-2 ">
        {updatedRoles.map(role => (
          <span
            key={role}
            className="bg-brandYellow text-white rounded-full px-3 py-1 text-xs flex items-center"
          >
            {role}
            <MdClose
              className="ml-1 cursor-pointer hover:text-red-600"
              onClick={() => removeRole(role)}
            />
          </span>
        ))}
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-[50%] outline-none px-4 py-1 dark:bg-gray-600 text-gray-800 dark:text-gray-300 border rounded-md"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="table-wrapper w-full overflow-x-auto custom-scrollbar bg-white dark:bg-gray-600">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {['Employee ID', 'Name', 'Email', 'Phone', 'Role', 'Action'].map(
                (header, index) => (
                  <th
                    key={index}
                    onClick={() =>
                      handleSort(header.toLowerCase().replace(' ', ''))
                    }
                    className="py-1 px-2 text-sm bg-brandYellow text-left font-medium text-gray-900 cursor-pointer"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr
                key={user._id}
                className="border-b text-sm dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="py-2 px-1 sm:px-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={updatedEmployeeId}
                      onChange={e => setUpdatedEmployeeId(e.target.value)}
                      className="border rounded-md px-2 py-1 w-full"
                    />
                  ) : (
                    user.employeeId
                  )}
                </td>
                <td className="py-2 px-1 sm:px-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={updatedName}
                      onChange={e => setUpdatedName(e.target.value)}
                      className="border rounded-md px-2 py-1 w-full"
                    />
                  ) : (
                    user.fullName
                  )}
                </td>
                <td className="py-2 px-1 sm:px-2 flex items-center">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={updatedEmail}
                      onChange={e => setUpdatedEmail(e.target.value)}
                      className="border rounded-md px-2 py-1 w-full"
                    />
                  ) : (
                    <>
                      {user.email}
                      <AiOutlineCopy
                        className="ml-2 cursor-pointer text-gray-500 dark:text-gray-300"
                        onClick={() => handleCopyEmail(user.email)}
                      />
                    </>
                  )}
                </td>
                <td className="py-2 px-1 sm:px-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={updatedPhone}
                      onChange={e => setUpdatedPhone(e.target.value)}
                      className="border rounded-md px-2 py-1 w-full"
                    />
                  ) : (
                    user.phone || '-'
                  )}
                </td>
                <td className="py-2 px-1 sm:px-2">
                  {editingUserId === user._id ? (
                    <div>
                      <select
                        className="border px-2 py-1 w-full rounded-md"
                        onChange={handleRoleChange}
                        value=""
                      >
                        <option value="" disabled>
                          Add Role
                        </option>

                        {['salesUser', 'billingManager', 'billingAgent'].map(
                          role => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ) : Array.isArray(user.role) ? (
                    user.role.join(', ')
                  ) : (
                    <span>{user?.role}</span>
                  )}
                </td>
                <td className="py-2 px-1 sm:px-2 flex items-center space-x-2">
                  {editingUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleSave(user._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <MdEdit
                        className="cursor-pointer text-blue-500"
                        onClick={() => handleEditClick(user)}
                      />
                      <MdDelete
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDeleteUser(user._id)}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination mt-4 flex justify-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            // Calculate the range of pages to show
            const startPage = Math.max(
              1,
              Math.min(totalPages - 4, currentPage - 2)
            ); // Ensures a maximum of 5 pages, starts near the current page
            const page = startPage + index;

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 mx-1 ${
                  currentPage === page
                    ? 'bg-brandYellow text-white'
                    : 'bg-gray-300'
                } rounded`}
              >
                {page}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowUsers;
