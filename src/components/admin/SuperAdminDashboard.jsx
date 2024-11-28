import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './../shared/Navbar';
import { useSelector } from "react-redux";


const SuperAdminDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvedRecruiters, setApprovedRecruiters] = useState([]);
  const [error, setError] = useState(null);
  const [recruiterIdToDelete, setRecruiterIdToDelete] = useState(''); 
  const apiEndpoint = import.meta.env.VITE_SUPERADMIN_API_END_POINT;
  const { user } = useSelector((store) => store.auth);


  console.log(user._id);

  useEffect(() => {
    fetchPendingApprovals();
    fetchApprovedRecruiters();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/pending-approvals`, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        setPendingApprovals(response.data.data);
      } else {
        // Show the backend's error message
        setError(response.data.message || 'Failed to load pending approvals.');
      }
    } catch (err) {
      // Show the error message from the backend, if available
      setError(err.response?.data?.message || 'Failed to load pending approvals.');
      console.error(err);
    }
  };
  
  const fetchApprovedRecruiters = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/approved-recruiters`, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        setApprovedRecruiters(response.data.data);
      } else {
        // Show the backend's error message
        setError(response.data.message || 'No approved recruiters found.');
      }
    } catch (err) {
      // Show the error message from the backend, if available
      setError(err.response?.data?.message || 'Failed to load approved recruiters.');
      console.error(err);
    }
  };
  



  // Approve or deny a recruiter
  const handleApproval = async (userId, action) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/handle-approval`,
        { userId, action },
        { withCredentials: true }
      );

      if (response.data.success) {
        fetchPendingApprovals(); // Refresh pending approvals
        fetchApprovedRecruiters(); // Refresh approved recruiters
      } else {
        setError(`Failed to ${action} recruiter.`);
      }
    } catch (err) {
      setError(`Error while trying to ${action} recruiter.`);
      console.error(err);
    }
  };

  // Delete recruiter account based on user input
  const deleteRecruiter = async () => {
    if (!recruiterIdToDelete) {
      setError('Please enter a recruiter ID.');
      return;
    }

    try {
      const response = await axios.post(
        `${apiEndpoint}/deleteRecruiterAccount`,
        { recruiterId: recruiterIdToDelete },
        { withCredentials: true }
      );

      if (response.data.success) {
        setRecruiterIdToDelete('');
        fetchApprovedRecruiters();
      } else {
        setError('Failed to delete recruiter.');
      }
    } catch (err) {
      setError('Error while deleting recruiter.');
      console.error(err);
    }
  };

  return (
    <div>
        <Navbar/>
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



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from './../shared/Navbar';
// import Cookies from 'js-cookie'; // Import js-cookie

// const SuperAdminDashboard = () => {
//   const [pendingApprovals, setPendingApprovals] = useState([]);
//   const [approvedRecruiters, setApprovedRecruiters] = useState([]);
//   const [error, setError] = useState(null);
//   const [recruiterIdToDelete, setRecruiterIdToDelete] = useState('');
//   const apiEndpoint = import.meta.env.VITE_SUPERADMIN_API_END_POINT;

//   const token = Cookies.get('token');  // The key should be 'token', not 'authToken'

//   useEffect(() => {
//     fetchPendingApprovals();
//     fetchApprovedRecruiters();
//   }, []);

//   const fetchPendingApprovals = async () => {
//     try {
//       // No need to retrieve token manually from cookies
//       const response = await axios.get(`${apiEndpoint}/pending-approvals`, {
//         withCredentials: true, // This ensures cookies are sent with the request
//       });
  
//       if (response.data.success) {
//         setPendingApprovals(response.data.data);
//       } else {
//         setError(response.data.message || 'Failed to load pending approvals.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load pending approvals.');
//       console.error(err);
//     }
//   };
  
//   const fetchApprovedRecruiters = async () => {
//     try {
//       const token = Cookies.get('authToken'); // Retrieve the token from cookies

//       if (!token) {
//         setError('No authentication token found.');
//         return;
//       }

//       const response = await axios.get(`${apiEndpoint}/approved-recruiters`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Pass token in Authorization header
//         },
//         withCredentials: true,  // Optional, depending on your use case
//       });

//       if (response.data.success) {
//         setApprovedRecruiters(response.data.data);
//       } else {
//         setError(response.data.message || 'No approved recruiters found.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load approved recruiters.');
//       console.error(err);
//     }
//   };

//   // Approve or deny a recruiter
//   const handleApproval = async (userId, action) => {
//     try {
//       const token = Cookies.get('authToken'); // Retrieve the token from cookies

//       if (!token) {
//         setError('No authentication token found.');
//         return;
//       }

//       const response = await axios.post(
//         `${apiEndpoint}/handle-approval`,
//         { userId, action },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass token in Authorization header
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         fetchPendingApprovals(); // Refresh pending approvals
//         fetchApprovedRecruiters(); // Refresh approved recruiters
//       } else {
//         setError(`Failed to ${action} recruiter.`);
//       }
//     } catch (err) {
//       setError(`Error while trying to ${action} recruiter.`);
//       console.error(err);
//     }
//   };

//   // Delete recruiter account based on user input
//   const deleteRecruiter = async () => {
//     if (!recruiterIdToDelete) {
//       setError('Please enter a recruiter ID.');
//       return;
//     }

//     try {
//       const token = Cookies.get('authToken'); // Retrieve the token from cookies

//       if (!token) {
//         setError('No authentication token found.');
//         return;
//       }

//       const response = await axios.post(
//         `${apiEndpoint}/deleteRecruiterAccount`,
//         { recruiterId: recruiterIdToDelete },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass token in Authorization header
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         setRecruiterIdToDelete('');
//         fetchApprovedRecruiters(); // Refresh approved recruiters list
//       } else {
//         setError('Failed to delete recruiter.');
//       }
//     } catch (err) {
//       setError('Error while deleting recruiter.');
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className='w-11/12 mx-auto mt-5'>
//         <h1 className="text-3xl font-semibold mb-4">Super Admin Dashboard</h1>

//         {/* Show error if any */}
//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         {/* Pending Approvals Section */}
//         <section className="mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
//           {pendingApprovals.length === 0 ? (
//             <p>No pending approvals found.</p>
//           ) : (
//             <ul>
//               {pendingApprovals.map((approval, index) => (
//                 <li key={index} className="border p-4 mb-2 rounded">
//                   <p><strong>Name:</strong> {approval.fullname}</p>
//                   <p><strong>Email:</strong> {approval.email}</p>
//                   <div className="flex justify-between mt-4">
//                     <button
//                       onClick={() => handleApproval(approval._id, 'approve')}
//                       className="bg-green-500 text-white px-4 py-2 rounded"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleApproval(approval._id, 'deny')}
//                       className="bg-red-500 text-white px-4 py-2 rounded"
//                     >
//                       Deny
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         {/* Approved Recruiters Section */}
//         <section>
//           <h2 className="text-2xl font-semibold mb-4">Approved Recruiters</h2>
//           {approvedRecruiters.length === 0 ? (
//             <p>No approved recruiters found.</p>
//           ) : (
//             <ul>
//               {approvedRecruiters.map((recruiter, index) => (
//                 <li key={index} className="border p-4 mb-2 rounded">
//                   <p><strong>Name:</strong> {recruiter.fullname}</p>
//                   <p><strong>Email:</strong> {recruiter.email}</p>
//                   <p><strong>ID:</strong> {recruiter._id}</p>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         {/* Delete Recruiter Section */}
//         <section className="mb-8 mt-8">
//           <h2 className="text-2xl font-semibold mb-4">Delete Recruiter</h2>
//           <div className="flex items-center space-x-4">
//             <input
//               type="text"
//               value={recruiterIdToDelete}
//               onChange={(e) => setRecruiterIdToDelete(e.target.value)}
//               placeholder="Enter Recruiter ID"
//               className="border p-2 rounded"
//             />
//             <button
//               onClick={deleteRecruiter}
//               className="bg-red-500 text-white px-4 py-2 rounded"
//             >
//               Delete Recruiter
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;
