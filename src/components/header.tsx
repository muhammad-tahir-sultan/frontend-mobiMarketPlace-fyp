import { useState } from "react"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import toast from "react-hot-toast"


export interface propsTypes {
    user: User | null
}

const Header = ({ user }: propsTypes) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    
    const logoutHandler = async () => {
        try {
            // Make a request to the backend to logout the user
            await signOut(auth)
            toast.success("Logout Successfully")
            localStorage.removeItem("user")
            setIsOpen(false)
        } catch (error) {
            setIsOpen(false)
            toast.success("Logout Failed")
        }
    }


    return (
        <nav className="header">

            <Link onClick={() => setIsOpen(false)} to="/">Home</Link>
            <Link onClick={() => setIsOpen(false)} to="/about">About</Link>
            <Link onClick={() => setIsOpen(false)} to="/contact">Contact</Link>
            <Link className="mt-1" onClick={() => setIsOpen(false)} to="/search"><FaSearch /></Link>
            <Link className="mt-1" onClick={() => setIsOpen(false)} to="/cart"><FaShoppingBag /></Link>

            {
                user?._id ? <>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <FaUser />
                    </button>
                    <dialog open={isOpen}>
                        <div>
                            {
                                user?.role === 'admin' && (
                                    <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">Admin</Link>
                                )
                            }
                            <Link onClick={() => setIsOpen(false)} to="/orders">Orders</Link>
                            <button onClick={logoutHandler}>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </dialog>
                </> : <>

                    <Link className="mt-1" onClick={() => setIsOpen(false)} to="/login"><FaSignInAlt /></Link>
                </>
            }
        </nav>
    )
}

export default Header