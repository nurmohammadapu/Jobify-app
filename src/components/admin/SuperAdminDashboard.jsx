import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './../shared/Navbar';
import { useSelector } from "react-redux";
import { toast } from "sonner";

const SuperAdminDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvedRecruiters, setApprovedRecruiters] = useState([]);
  const [error, setError] = useState(null);
  const [recruiterIdToDelete, setRecruiterIdToDelete] = useState('');
  const apiEndpoint = import.meta.env.VITE_SUPERADMIN_API_END_POINT;
  const { token } = useSelector((store) => store.auth);

  // Fetch pending approvals and approved recruiters on mount
  useEffect(() => {
      fetchPendingApprovals();
      fetchApprovedRecruiters();
  }, [approvedRecruiters,setPendingApprovals]);

  const fetchPendingApprovals = async () => {
      try {
          const res = await axios.get(`${apiEndpoint}/pending-approvals`,
            { headers: { Authorization: `Bearer ${token}` },
              withCredentials: true }
          );
          setPendingApprovals(res.data.data);
      } catch (err) {
          const errorMessage = err.response?.data?.message || 'Failed to fetch pending approvals.';
          setError(errorMessage);
          toast.error(errorMessage); // Display error toast
      }
  };

  const fetchApprovedRecruiters = async () => {
      try {
          const res = await axios.get(`${apiEndpoint}/approved-recruiters`,
            { headers: { Authorization: `Bearer ${token}` },
              withCredentials: true }
          );
          setApprovedRecruiters(res.data.data);
      } catch (err) {
          const errorMessage = err.response?.data?.message || 'Failed to fetch approved recruiters.';
          setError(errorMessage);
          toast.error(errorMessage); // Display error toast
      }
  };

  const handleApproval = async (userId, action) => {
      try {
          const res = await axios.post(`${apiEndpoint}/handle-approval`, 
              { userId, action }, 
              { headers: { Authorization: `Bearer ${token}` },
                withCredentials: true }
          );
          toast.success(res.data.message); // Show success toast
          fetchPendingApprovals();
      } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error processing approval action.';
          toast.error(errorMessage); // Show error toast
      }
  };

  const deleteRecruiter = async () => {
      try {
          const res = await axios.post(`${apiEndpoint}/deleteRecruiterAccount`, 
              { recruiterId: recruiterIdToDelete }, 
              { headers: { Authorization: `Bearer ${token}` },
                withCredentials: true }
          );
          toast.success(res.data.message); // Show success toast
          fetchApprovedRecruiters();
          setRecruiterIdToDelete(''); // Clear the input after deleting
      } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error deleting recruiter.';
          toast.error(errorMessage); // Show error toast
      }
  };

  return (
    <div>
      <Navbar />
      <div className='w-11/12 mx-auto mt-5'>
        <h1 className="text-3xl font-semibold mb-4">Super Admin Dashboard</h1>

        {/* Show error if any */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Pending Approvals Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
          {pendingApprovals.length === 0 ? (
            <p>No pending approvals found.</p>
          ) : (
            <ul>
              {pendingApprovals.map((approval, index) => (
                <li key={index} className="border p-4 mb-2 rounded">
                  <p><strong>Name:</strong> {approval.fullname}</p>
                  <p><strong>Email:</strong> {approval.email}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleApproval(approval._id, 'approve')}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(approval._id, 'deny')}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Deny
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Approved Recruiters Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Approved Recruiters</h2>
          {approvedRecruiters.length === 0 ? (
            <p>No approved recruiters found.</p>
          ) : (
            <ul>
              {approvedRecruiters.map((recruiter, index) => (
                <li key={index} className="border p-4 mb-2 rounded">
                  <p><strong>Name:</strong> {recruiter.fullname}</p>
                  <p><strong>Email:</strong> {recruiter.email}</p>
                  <p><strong>ID:</strong> {recruiter._id}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Delete Recruiter Section */}
        <section className="mb-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Delete Recruiter</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={recruiterIdToDelete}
              onChange={(e) => setRecruiterIdToDelete(e.target.value)}
              placeholder="Enter Recruiter ID"
              className="border p-2 rounded"
            />
            <button
              onClick={deleteRecruiter}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Recruiter
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
