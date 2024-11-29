// import React, { useEffect, useState } from 'react'

// import Navbar from '../shared/Navbar'
// import { Label } from '../ui/label'
// import { Input } from '../ui/input'
// import { Button } from '../ui/button'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { useDispatch, useSelector } from 'react-redux'
// import { setLoading, setUser } from '@/redux/authSlice'
// import { Loader2 } from 'lucide-react'
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

// const Login = () => {
//     const [input, setInput] = useState({
//         email: "",
//         password: "",
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const USER_API_END_POINT = import.meta.env.VITE_USER_API_END_POINT;
//     const { loading,user } = useSelector(store => store.auth);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         try {
//             dispatch(setLoading(true));
//             const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 withCredentials: true,
//             });
//             if (res.data.success) {
//                 dispatch(setUser(res.data.user));
//                 navigate("/");
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response.data.message);
//         } finally {
//             dispatch(setLoading(false));
//         }
//     }
//     useEffect(()=>{
//         if(user){
//             navigate("/");
//         }
//     },[])
//     return (
//       <div>
//         <Navbar />
//         <div className="flex items-center justify-center max-w-7xl mx-auto">
//           <form
//             onSubmit={submitHandler}
//             className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
//           >
//             <h1 className="font-bold text-xl mb-5">Login</h1>
//             <div className="my-2">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={input.email}
//                 name="email"
//                 onChange={changeEventHandler}
//                 placeholder="patel@gmail.com"
//               />
//             </div>

//             <div className="my-2">
//               <Label>Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   value={input.password}
//                   name="password"
//                   onChange={changeEventHandler}
//                   placeholder="patel@gmail.com"
//                 />
//                 <span
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//                 >
//                   {showPassword ? (
//                     <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
//                   ) : (
//                     <AiOutlineEye fontSize={24} fill="#AFB2BF" />
//                   )}
//                 </span>
//               </div>
//             </div>
//             {loading ? (
//               <Button className="w-full my-4">
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
//               </Button>
//             ) : (
//               <Button type="submit" className="w-full my-4">
//                 Login
//               </Button>
//             )}
//             <span className="text-sm">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-blue-600">
//                 Signup
//               </Link>
//             </span>
//           </form>
//         </div>
//       </div>
//     );
// }

// export default Login



import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // For notifications
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser, setError, setToken } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const USER_API_END_POINT = import.meta.env.VITE_USER_API_END_POINT; // API Endpoint from env
  const { loading, user, error } = useSelector((store) => store.auth); // Redux state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true)); // Start loading
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Send cookies with the request
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setToken(res.data.token)) 
        navigate("/"); // Redirect to home page
        toast.success(res.data.message); // Success notification
      }
    } catch (error) {
      console.error("Login Error:", error);
      dispatch(setError(error.response?.data?.message || "An error occurred")); // Set error in Redux
      toast.error(error.response?.data?.message || "An error occurred"); // Show error notification
    } finally {
      dispatch(setLoading(false)); // Stop loading
    }
  };

  // Redirect logged-in users to the homepage
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>

          {/* Email Input */}
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="john.doe@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="my-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
          </div>



          {/* Submit Button */}
          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Login
            </Button>
          )}

          {/* Signup Link */}
          <span className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
