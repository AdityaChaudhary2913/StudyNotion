import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { MobNavbarLinks } from "../../data/mobnavlinks";
import { TokenMobNavbarLinks } from "../../data/withTokenMobNavLinks"
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";

function Navbar() {
	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);
	const { totalItems } = useSelector((state) => state.cart);
	const location = useLocation();
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);

	const [subLinks, setSubLinks] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await apiConnector("GET", categories.CATEGORIES_API);
				setSubLinks(res.data.data);
			} catch (error) {
				console.log("Could not fetch Categories.", error);
			}
			setLoading(false);
		})();
	}, []);
	const matchRoute = (route) => {
		return matchPath({ path: route }, location.pathname);
	};

	return (
		<div
			className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
				location.pathname !== "/" ? "bg-richblack-800" : ""
			} transition-all duration-200`}>
			<div className="flex w-11/12 max-w-maxContent items-center justify-between">
				{/* Logo */}
				<Link to="/">
					<img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
				</Link>
				{/* Navigation links */}
				<nav className="hidden sm:block">
					<ul className="flex gap-x-6 text-richblack-25">
						{NavbarLinks.map((link, index) => (
							<li key={index}>
								{link.title === "Catalog" ? (
									<>
										<div
											className={`group relative flex cursor-pointer items-center gap-1 ${
												matchRoute("/catalog/:catalogName")
													? "text-yellow-25"
													: "text-richblack-25"
											}`}>
											<p>{link.title}</p>
											<BsChevronDown />
											<div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
												<div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
												{loading ? (
													<p className="text-center">Loading...</p>
												) : subLinks?.length ? (
													<>
														{subLinks?.map((subLink, i) => (
															<Link
																to={`/catalog/${subLink.name
																	.split(" ")
																	.join("-")
																	.toLowerCase()}`}
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
									</>
								) : (
									<Link to={link?.path}>
										<p
											className={`${
												matchRoute(link?.path)
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
				{/* Login / Signup / Dashboard */}
				<div className="hidden items-center gap-x-4 sm:flex">
					{user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
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
							<button className="rounded-md border border-richblack-700 bg-richblack-800 px-[20px] py-[9px] text-richblack-100">
								Log in
							</button>
						</Link>
					)}
					{token === null && (
						<Link to="/signup">
							<button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
								Sign up
							</button>
						</Link>
					)}
					{token !== null && <ProfileDropDown />}
				</div>
				<div
					className="sm:hidden flex flex-1 justify-end items-center text-white"
					onClick={() => setToggle(!toggle)}>
					{!toggle ? (
						<div className="object-contain cursor-pointer">
							<AiOutlineMenu fontSize={23} fill="#AFB2BF" />
						</div>
					) : (
						<IoCloseSharp fontSize={25} fill="#AFB2BF" />
					)}
					<div
						className={`${
							!toggle ? "hidden" : "flex"
						} p-6 black-gradient absolute bg-[rgb(5,8,22)] top-[35px] right-0 mx-4 my-2 min-w-[140px] z-50 rounded-xl`}>
						<ul className="list-none flex justify-end items-start flex-col gap-4">
              {
                token ? (<>{TokenMobNavbarLinks.map((link, index) => (
                  <>
										<li
											key={index}
											className={`${
												active === link.title ? "text-white" : "text-secondary"
											} font-poppins text-[16px] font-medium cursor-pointer`}
											onClick={() => {
												setActive(link.title);
												setToggle(!toggle);
											}}>
											<a href={link?.path}>{link.title}</a>
										</li>
                  </>
							))}</>) : (<>{MobNavbarLinks.map((link, index) => (
                  <>
										<li
											key={index}
											className={`${
												active === link.title ? "text-white" : "text-secondary"
											} font-poppins text-[16px] font-medium cursor-pointer`}
											onClick={() => {
												setActive(link.title);
												setToggle(!toggle);
											}}>
											<a href={link?.path}>{link.title}</a>
										</li>
                  </>
							))}</>)
              }
							
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Navbar;

// const Navbar = () => {
//   const {token} = useSelector((state) => state.auth);
//   const {user} = useSelector((state) => state.profile);
//   const {totalItems} = useSelector((state) => state.cart);
//   const location = useLocation();
//   const [toggle, setToggle] = useState(false);
//   const [active, setActive] = useState("");

//   const [subLinks, setSubLinks] = useState([]);
//   const fetchSubLinks = async () => {
//     try{
//       const result = await apiConnector("GET", categories.CATEGORIES_API);
// 			setSubLinks(result.data.data);
//     } catch(err){
//       toast.error("Can't fetch Categories!")
//     }
//   }
//   useEffect(() => {
//     fetchSubLinks();
//   }, []);
//   const matchRoute = (route) => {
// 		return matchPath({ path: route }, location.pathname);
// 	};
//   return (
//     <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
//       <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
//         <Link to="/"><img src={logo} alt=''/></Link>
//         <nav>
//           <ul className='flex gap-x-6 text-richblack-25'>
//             {
//               NavbarLinks.map( (link, index) => (
//                 <li key={index}>
//                   {
//                     link.title === "Catalog" ?
//                     (<div className='flex relative z-30 gap-2 items-center group'>
//                       <p>{link.title}</p>
//                       <IoIosArrowDropdownCircle />
//                       <div className="invisible absolute left-0 top-[170%] flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
//                                 opacity-0 transition-all duration-200 group-hover:visible
//                                 group-hover:opacity-100 lg:w-[220px]">
//                           <div className="absolute left-[50%] top-0 translate-x-[-380%]
//                                 translate-y-[-30%] h-6 w-6 rotate-45 rounded bg-richblack-5">
//                           </div>
//                           {
//                             subLinks.length ? (
//                               subLinks?.map( (subLink, index) => (
//                                 <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index} className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50'>
//                                   <p>{subLink.name}</p>
//                                 </Link>
//                               ) )
//                             ) : (<div></div>)
//                           }
//                       </div>
//                     </div>)
//                     :
//                     (<div>
//                       <Link to={link?.path}>
//                         <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
//                           {link.title}
//                         </p>
//                         </Link>
//                     </div>)
//                   }
//                 </li>
//               ) )
//             }
//           </ul>
//         </nav>
//         <div className="hidden md:flex gap-x-4 items-center">
//           {
//             user &&
//             user?.accountType !== "Instructor" &&
//             (<Link to='/dashboard/cart' className='relative'>
//               <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
//               {totalItems > 0 && (
//                 <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
//                   {totalItems}
//                 </span>
//               )}
//             </Link>)
//           }
//           {
//             token === null && (
//               <Link to='/login'>
//                 <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
//                   Log in
//                 </button>
//               </Link>
//             )
//           }
//           {
//             token === null && (
//               <Link to='/signup'>
//                 <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
//                   Sign Up
//                 </button>
//               </Link>
//             )
//           }
//           {token !== null && <ProfileDropDown />}
//         </div>
//         {/* <div className='sm:hidden flex flex-1 justify-end items-center text-white'>
//           <img src={toggle ? close : menu} className='w-[28px] h-[28px] object-contain cursor-pointer' onClick={() => setToggle(!toggle)} alt='' />
//           <div className={`${!toggle ? "hidden" : "flex"} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
//             <ul className='list-none flex justify-end items-start flex-col gap-4'>
//               {
//                 NavbarLinks.map((link) => (
//                   <li key={link.id} className={`${active === link.title ? "text-white" : "text-secondary"} font-poppins text-[16px] font-medium cursor-pointer`} onClick={() => {setActive(link.title); setToggle(!toggle)}}>
//                     <a href={link?.path}>{link.title}</a>
//                   </li>
//                 ))
//               }
//             </ul>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   )
// }

// export default Navbar
