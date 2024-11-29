import { setAllAdminJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllAdminJobs = () => {
    const JOB_API_END_POINT = import.meta.env.VITE_JOB_API_END_POINT;
    const dispatch = useDispatch();
    const { token } = useSelector((store) => store.auth); // Get the token from authSlice

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/getadminjobs`,
                    {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the headers
                    }
                );
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error.response?.data?.message || 'Failed to fetch admin jobs');
            }
        };
        fetchAllAdminJobs();
    }, [token]); // Add token as a dependency in case it changes
};

export default useGetAllAdminJobs;
