import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import axios from 'axios';



const VerifyEmail = () => {
    const USER_API_END_POINT = import.meta.env.VITE_USER_API_END_POINT;
    const { signupData, loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (!signupData) {
            navigate("/signup");
        }
    }, [signupData, navigate]);
    
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    
    const handleVerifyAndSignup = async (e) => {
        e.preventDefault();
    
        // OTP Validation
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
    
        const formData = new FormData();
        formData.append('fullname', signupData.fullname);
        formData.append('email', signupData.email);
        formData.append('phoneNumber', signupData.phoneNumber);
        formData.append('password', signupData.password);
        formData.append('confirmPassword', signupData.confirmPassword);
        formData.append('role', signupData.role);
        formData.append('otp', otp); 
        


        
        try {
            dispatch(setLoading(true));
    
            // Sending the FormData to the API
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },  // Ensure this header is set
                withCredentials: true,
            });
    
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log("API Error: ", error);
            toast.error(error.response?.data?.message || 'Something went wrong!');
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    const handleResendOtp = async () => {
        const { email } = signupData;  // Use email directly from signupData
        
        try {
            dispatch(setLoading(true));
    
            // Send the email as it is (no need for base64 encoding)
            const res = await axios.post(`${USER_API_END_POINT}/sendotp`, { email });
    
            if (!res.data.success) {
                throw new Error(res.data.message);
            }
    
            toast.success("OTP Sent Successfully");
        } catch (error) {
            console.error("SENDOTP API ERROR:", error);
            const errorMessage = error.response?.data?.message || error.message || "Could Not Send OTP";
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form onSubmit={handleVerifyAndSignup} className="w-1/3 border border-gray-200 rounded-md p-4 my-10">
                    <h1 className="font-bold text-xl mb-5">Verify Email</h1>
                    <div className="my-2">
                        <Label>Enter OTP</Label>
                        <Input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>

                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            Please wait...
                        </Button>
                    ) : (
                        <>
                            <Button type="submit" className="w-full my-4">
                                Verify OTP
                            </Button>
                            <Button 
                                type="button" 
                                className="w-full my-4 bg-blue-500" 
                                onClick={handleResendOtp} 
                                disabled={loading}
                            >
                                Resend OTP
                            </Button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;
