import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { LuMenu } from "react-icons/lu";

const MobileNavbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const USER_API_END_POINT = import.meta.env.VITE_USER_API_END_POINT;
    
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <Sheet>
            <SheetTrigger>
                <LuMenu size={24} className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="shad-sheet h-screen px-3">
                <SheetTitle>
                    <h1 className='text-2xl font-bold'>Jobi<span className='text-[#6A38C2]'>fy</span></h1>
                </SheetTitle>

                <nav className="mobile-nav">
                    <ul className="flex flex-col items-center gap-4">
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) :
                            user && user.role === 'super-admin' ? (
                                <>
                                    <li><Link to="/superadmindashboard">DashBoard</Link></li>
                                </>
                            ) :
                            
                            (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                    <li><Link to="/ai">AI</Link></li>
                                </>
                            )
                        }
                        {
                            !user ? (
                                <div className='flex flex-col items-center gap-4'>
                                    <Link to="/login"><Button variant="outline">Login</Button></Link>
                                    <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center gap-4'>
                                    <div className="flex gap-2 items-center">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                            <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col my-2 text-gray-600">
                                        {user && user.role === 'student' && (
                                            <div className='flex items-center gap-2'>
                                                <User2 />
                                                <Button variant="link">
                                                    <Link to="/profile">View Profile</Link>
                                                </Button>
                                            </div>
                                        )}
                                        <div className='flex items-center gap-2'>
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">Logout</Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNavbar;
