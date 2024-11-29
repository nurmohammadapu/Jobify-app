// import { setCompanies} from '@/redux/companySlice'
// import axios from 'axios'
// import { useEffect } from 'react'
// import { useDispatch } from 'react-redux'

// const useGetAllCompanies = () => {
//     const dispatch = useDispatch();
//     const COMPANY_API_END_POINT = import.meta.env.VITE_COMPANY_API_END_POINT;

//     useEffect(()=>{
//         const fetchCompanies = async () => {
//             try {
//                 const res = await axios.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true});
//                 console.log('called');
//                 if(res.data.success){
//                     dispatch(setCompanies(res.data.companies));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchCompanies();
//     },[])
// }

// export default useGetAllCompanies



import { setCompanies } from '@/redux/companySlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const COMPANY_API_END_POINT = import.meta.env.VITE_COMPANY_API_END_POINT;
    const { token } = useSelector((store) => store.auth); // Get the token from authSlice

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(
                    `${COMPANY_API_END_POINT}/get`,
                    {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the headers
                    }
                );
                console.log('called');
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error.response?.data?.message || 'Failed to fetch companies');
            }
        };
        fetchCompanies();
    }, [token]); // Add token as a dependency in case it changes
};

export default useGetAllCompanies;
