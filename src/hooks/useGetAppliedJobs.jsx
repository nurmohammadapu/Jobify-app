// import { setAllAppliedJobs } from "@/redux/jobSlice";
// import axios from "axios"
// import { useEffect } from "react"
// import { useDispatch } from "react-redux"

// const useGetAppliedJobs = () => {
//     const dispatch = useDispatch();
//     const APPLICATION_API_END_POINT = import.meta.env.VITE_APPLICATION_API_END_POINT;
//     useEffect(()=>{
//         const fetchAppliedJobs = async () => {
//             try {
//                 const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
//                 console.log(res.data);
//                 if(res.data.success){
//                     dispatch(setAllAppliedJobs(res.data.application));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchAppliedJobs();
//     },[])
// };
// export default useGetAppliedJobs;

import { setAllJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const JOB_API_END_POINT = import.meta.env.VITE_JOB_API_END_POINT;
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((store) => store.job); // Get the search query from the Redux store
    const { token } = useSelector((store) => store.auth); // Get the token from authSlice

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,
                    {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the headers
                    }
                );
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error.response?.data?.message || 'Failed to fetch jobs');
            }
        };
        fetchAllJobs();
    }, [searchedQuery, token]); // Add dependencies for searchedQuery and token

};

export default useGetAllJobs;



