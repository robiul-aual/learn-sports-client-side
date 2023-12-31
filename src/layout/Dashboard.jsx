import { FaCheck, FaPlusSquare, FaRegUser } from "react-icons/fa";
import { MdManageAccounts, MdManageHistory } from "react-icons/md"
import icon from '../assets/contract.png'
import { Link, Outlet } from "react-router-dom";
import useAdminInstructor from "../hooks/useAdminInstructor";
import { Fade } from "react-awesome-reveal";

const Dashboard = () => {
    const [isAdminInstructor] = useAdminInstructor();
    const role = isAdminInstructor?.role;
    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content relative">
                <div className="w-9/12 ms-80">
                    <Fade delay={1e3}><Outlet /></Fade>
                </div>
                <label htmlFor="my-drawer" className="btn btn-primary absolute top-0 drawer-button">Open drawer</label>
            </div>
            <div className="drawer-side ">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 h-full text-white bg-emerald-900">
                    {role === 'student' &&
                        <>
                            < li > <Link to='myClass'><FaCheck />My Selected Classes</Link></li>
                            <li><Link to='myEnroll'><img src={icon} alt="" className="w-4 h-4 text-white" /> My Enrolled Classes</Link></li>
                            <li><Link to='paymentHistory'><img src={icon} alt="" className="w-4 h-4 text-white" /> Payment History</Link></li>
                        </>
                    }
                    {role === "instructor" &&
                        <>
                            <li><Link to='addClass'><FaPlusSquare />Add Class</Link></li>
                            <li><Link to='instructorClass'><FaRegUser /> My Classes</Link></li>
                        </>
                    }
                    {role === "admin" &&
                        <>
                            <li><Link to='manageClass'><MdManageHistory />Manage Classes</Link></li>
                            <li><Link to='manageUsers'><MdManageAccounts /> All Users</Link></li>
                        </>
                    }
                    <div className="divider border-red-600"></div>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/instructor'>Instructors</Link></li>
                    <li><Link to='/classes'>Classes</Link></li>
                </ul>
            </div>
        </div >
    );
};

export default Dashboard;