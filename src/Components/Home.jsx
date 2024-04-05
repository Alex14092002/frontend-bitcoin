import React from "react";
import { IoIosArrowDown, IoMdHome } from "react-icons/io";
import logo from "./Assets/Images/logo.png";
import { RiEarthLine, RiHealthBookLine, RiSettings5Line } from "react-icons/ri";
import {
	FaAlignRight,
	FaAngleDown,
	FaArrowDownWideShort,
	FaArrowUp,
	FaArrowUpRightDots,
	FaArrowUpShortWide,
	FaCircleInfo,
	FaLightbulb,
} from "react-icons/fa6";
import ProgressBar from "@ramonak/react-progress-bar";
import { Link } from "react-router-dom";
import TradingView from "./TradingView";
import { Button } from "antd";

export default function Home() {
	const email = localStorage.getItem("email");
	const id = localStorage.getItem("id");
	const logOut = () => {
		localStorage.removeItem("email");
		localStorage.removeItem("id");
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	};
	return (
		<>
			<header className=' h-[64px] flex flex-row justify-between items-center gap-2 bg-gray-900 text-[#eaecef] font-medium'>
				<IoMdHome className='w-6 h-6' />
				<img src={logo} alt='logo' className='object-cover h-[64px]' />
				<div className='flex-row items-center gap-1 hover:text-[#fcd535] hidden sm:flex'>
					<span>Futures</span>
					<IoIosArrowDown />
				</div>
				<div className='flex-row items-center gap-1 hover:text-[#fcd535] hidden sm:flex'>
					<span>Quền chọn</span>
					<IoIosArrowDown />
				</div>
				<div className='flex-row items-center gap-1 hover:text-[#fcd535] hidden sm:flex'>
					<span>Bot giao dịch</span>
					<IoIosArrowDown />
				</div>
				<span className='hover:text-[#fcd535] hidden sm:flex'>
					Sao chép giao dịch
				</span>
				<div className='flex-row items-center gap-1 hover:text-[#fcd535] hidden sm:flex'>
					<span>Dữ liệu</span>
					<IoIosArrowDown />
				</div>
				<div className='flex-row items-center gap-1 hover:text-[#fcd535] hidden sm:flex'>
					<span>Xem thêm</span>
					<IoIosArrowDown />
				</div>
				<span className=' hidden sm:block'>Thử thách</span>
				<div className='flex-row gap-2 items-center hover:text-[#fcd535] hidden sm:flex'>
					<span>
						Futures <span>NEXT</span>
					</span>
					<div className='text-gray-800 bg-[#fcd535] px-1 text-xs rounded'>
						New
					</div>
				</div>
				{!email && !id ? (
					<>
						<div className=' hidden sm:block'>
							<Link to='/login' className='text-sm'>
								Đăng nhập
							</Link>
						</div>
						<div className=' hidden sm:block'>
							<Link
								to='/signup'
								className='text-gray-800 bg-[#fcd535] rounded-md py-2 px-2 text-sm'>
								Đăng ký
							</Link>
						</div>
					</>
				) : (
					<>
						<div className=' hidden sm:block'>
							<Link to='/login' className='text-sm'>
								Xin chào{" "}
								<span className='font-bold text-[#fcd535]'>{email}</span>
							</Link>
							<Button onClick={() => logOut()} className='bg-[#fcd535] mx-2'>
								Đăng xuất
							</Button>
						</div>
					</>
				)}
				{/* <div className='flex flex-row items-center gap-4'>
					<RiEarthLine className='w-6 h-6 ' />
					<RiHealthBookLine className='w-6 h-6 ' />
					<RiSettings5Line className='w-6 h-6 ' />
				</div> */}
			</header>
			<TradingView />
		</>
	);
}
