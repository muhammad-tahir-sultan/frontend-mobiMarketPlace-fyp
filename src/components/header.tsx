import { useEffect, useRef, useState } from "react"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa"
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    const userMenuRef = useRef<HTMLDivElement>(null)
    
    const logoutHandler = async () => {
        try {
            // Make a request to the backend to logout the user
            await signOut(auth)
            toast.success("Logout Successfully")
            localStorage.removeItem("user")
            setIsOpen(false)
            setIsMobileMenuOpen(false)
        } catch (error) {
            setIsOpen(false)
            setIsMobileMenuOpen(false)
            toast.success("Logout Failed")
        }
    }

    const closeAllMenus = () => {
        setIsOpen(false)
        setIsMobileMenuOpen(false)
    }
    
    // Handle clicks outside the user menu to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <nav className="header">
            <div className="logo">
                <Link to="/" onClick={closeAllMenus}>
                    <img src="/logo.jpg" alt="MobiCommerce Logo" className="logo-image" />
                    <span>MobiCommerce</span>
                </Link>
            </div>
            
            <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
            
            <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <Link onClick={closeAllMenus} to="/">Home</Link>
                <Link onClick={closeAllMenus} to="/about">About</Link>
                <Link onClick={closeAllMenus} to="/contact">Contact</Link>
                <Link className="mt-1" onClick={closeAllMenus} to="/search"><FaSearch /></Link>
                <Link className="mt-1" onClick={closeAllMenus} to="/cart"><FaShoppingBag /></Link>

                {
                    user?._id ? (
                        <div className="user-menu-container" ref={userMenuRef}>
                            <button 
                                className="user-menu-button" 
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="User menu"
                            >
                                <FaUser />
                            </button>
                            
                            {isOpen && (
                                <div className="user-dropdown">
                                    {user?.role === 'admin' && (
                                        <Link 
                                            onClick={closeAllMenus} 
                                            to="/admin/dashboard"
                                            className="dropdown-item"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link 
                                        onClick={closeAllMenus} 
                                        to="/orders"
                                        className="dropdown-item"
                                    >
                                        My Orders
                                    </Link>
                                    <button 
                                        onClick={logoutHandler}
                                        className="dropdown-item logout-button"
                                    >
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link 
                            className="mt-1" 
                            onClick={closeAllMenus} 
                            to="/login"
                        >
                            <FaSignInAlt />
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Header