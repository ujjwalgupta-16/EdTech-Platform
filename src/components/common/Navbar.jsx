import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)
    const location = useLocation()

    const [subLinks, setSubLinks] = useState([])
    const [loading, setLoading] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [catalogOpen, setCatalogOpen] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                setSubLinks(res.data.data)
            } catch (error) {
                console.log("Could not fetch Categories.", error)
            }
            setLoading(false)
        })()
    }, [])

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
        setCatalogOpen(false) // Close catalog dropdown when closing sidebar
    }

    return (
        <div
            className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""
                } transition-all duration-200`}>
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                <Link to="/">
                    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}>
                                        <p>{link.title}</p>
                                        <BsChevronDown />
                                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                            {loading ? (
                                                <p className="text-center">Loading...</p>
                                            ) : (subLinks && subLinks.length) ? (
                                                <>
                                                    {subLinks?.map((subLink, i) => (
                                                        <Link
                                                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                            key={i}>
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ))}
                                                </>
                                            ) : (
                                                <p className="text-center">No Courses Found</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p
                                            className={`${matchRoute(link?.path)
                                                ? "text-yellow-25"
                                                : "text-richblack-25"
                                                }`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="hidden items-center gap-x-4 md:flex">
                    {user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null && (
                        <Link to="/login">
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Log in
                            </button>
                        </Link>
                    )}
                    {token === null && (
                        <Link to="/signup">
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Sign up
                            </button>
                        </Link>
                    )}
                    {token !== null && <ProfileDropdown />}
                </div>
                <button className="mr-4 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                </button>
            </div>
            {mobileMenuOpen && (
                <div className="absolute top-0 left-0 z-[1000] h-screen w-full bg-richblack-800 text-richblack-100 md:hidden">
                    <div className="flex justify-between items-center p-4 border-b border-richblack-700">
                        <Link to="/">
                            <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                        </Link>
                        <button onClick={closeMobileMenu}>
                            <AiOutlineClose fontSize={24} fill="#AFB2BF" />
                        </button>
                    </div>
                    <ul className="flex flex-col items-center gap-4 p-4 mt-4">
                        {NavbarLinks.map((link, index) => (
                            <li key={index} className="w-full text-center">
                                {link.title === "Catalog" ? (
                                    <div className={`relative flex cursor-pointer items-center justify-center gap-1 ${catalogOpen ? "text-yellow-25" : "text-richblack-25"}`}
                                        onClick={() => setCatalogOpen(!catalogOpen)}>
                                        <p>{link.title}</p>
                                        <BsChevronDown />
                                        {catalogOpen && (
                                            <div className="absolute left-1/2 z-[1000] w-48 -translate-x-1/2 translate-y-4 flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-100 transition-all duration-150">
                                                <div className="absolute left-1/2 top-0 -z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 select-none rounded bg-richblack-5"></div>
                                                {loading ? (
                                                    <p className="text-center">Loading...</p>
                                                ) : (subLinks && subLinks.length) ? (
                                                    <>
                                                        {subLinks?.map((subLink, i) => (
                                                            <Link
                                                                to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                                className="block w-full rounded-lg bg-transparent py-2 pl-2 text-center hover:bg-richblack-50"
                                                                key={i}
                                                                onClick={closeMobileMenu}>
                                                                <p>{subLink.name}</p>
                                                            </Link>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <p className="text-center">No Courses Found</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link to={link?.path} onClick={closeMobileMenu}>
                                        <p
                                            className={`${matchRoute(link?.path)
                                                ? "text-yellow-25"
                                                : "text-richblack-25"
                                                }`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                        {user && user?.accountType !== "Instructor" && (
                            <li className="w-full text-center">
                                <Link to="/dashboard/cart" className="relative" onClick={closeMobileMenu}>
                                    <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                                    {totalItems > 0 && (
                                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )}
                        {token === null && (
                            <li className="w-full text-center">
                                <Link to="/login" onClick={closeMobileMenu}>
                                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                        Log in
                                    </button>
                                </Link>
                            </li>
                        )}
                        {token === null && (
                            <li className="w-full text-center">
                                <Link to="/signup" onClick={closeMobileMenu}>
                                    <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                        Sign up
                                    </button>
                                </Link>
                            </li>
                        )}
                        {token !== null && (
                            <li className="w-full text-center">
                                <ProfileDropdown />
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Navbar
