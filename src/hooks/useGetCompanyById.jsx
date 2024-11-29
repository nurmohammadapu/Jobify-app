// import { setSingleCompany } from '@/redux/companySlice'
// import { setAllJobs } from '@/redux/jobSlice'
// import axios from 'axios'
// import { useEffect } from 'react'
// import { useDispatch } from 'react-redux'

// const useGetCompanyById = (companyId) => {
//     const dispatch = useDispatch();
//     const COMPANY_API_END_POINT = import.meta.env.VITE_COMPANY_API_END_POINT;
//     useEffect(()=>{
//         const fetchSingleCompany = async () => {
//             try {
//                 const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});
//                 console.log(res.data.company);
//                 if(res.data.success){
//                     dispatch(setSingleCompany(res.data.company));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchSingleCompany();
//     },[companyId, dispatch])
// }

// export default useGetCompanyById

import { setSingleCompany } from '@/redux/companySlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const COMPANY_API_END_POINT = import.meta.env.VITE_COMPANY_API_END_POINT;
    const { token } = useSelector((store) => store.auth); // Get the token from authSlice

    useEffect(() => {
        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(
                    `${COMPANY_API_END_POINT}/get/${companyId}`,
                    {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the headers
                    }
                );
                console.log(res.data.company);
                if (res.data.success) {
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error.response?.data?.message || 'Failed to fetch company details');
            }
        };
        fetchSingleCompany();
    }, [companyId, token, dispatch]); // Added token to dependency array
};

export default useGetCompanyById;
