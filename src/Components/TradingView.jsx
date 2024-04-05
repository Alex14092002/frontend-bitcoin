import React, { useState, useEffect } from "react";
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
import { notification } from "antd";

import { Button, Modal, Input } from "antd";

const TradingView = ({ defaultCoin = "btcusdt" }) => {
	const [coinData, setCoinData] = useState({});
	const [nameCoin, setNameCoin] = useState(defaultCoin);
	const [dataUser, setDataUser] = useState({ assets: [], balance: 0 });

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpenBuy, setIsModalOpenBuy] = useState(false);
	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const showModalBuy = () => {
		setIsModalOpenBuy(true);
	};

	const handleCancelBuy = () => {
		setIsModalOpenBuy(false);
	};
	const email = localStorage.getItem("email");
	const id = localStorage.getItem("id");
	useEffect(() => {
		const ws = new WebSocket(
			`wss://stream.binance.com:9443/ws/${nameCoin}@trade`
		);
		let totalVolume = 0;

		ws.onmessage = (event) => {
			const stockObj = JSON.parse(event.data);
			const currentPrice = parseFloat(stockObj.p);
			const timestamp = stockObj.T;

			setCoinData((prevData) => {
				const updatedCoinData = { ...prevData };
				if (!updatedCoinData[nameCoin]) {
					updatedCoinData[nameCoin] = {
						stockPrice: null,
						markPrice: null,
						index: null,
						priceChange: null,
						highPrice: null,
						lowPrice: null,
						volume: null,
					};
				}

				updatedCoinData[nameCoin] = {
					...updatedCoinData[nameCoin],
					stockPrice: currentPrice,
				};

				if (updatedCoinData[nameCoin].markPrice === null) {
					updatedCoinData[nameCoin].markPrice = currentPrice;
				}

				if (
					updatedCoinData[nameCoin].lowPrice === null ||
					updatedCoinData[nameCoin].lowPrice > currentPrice
				) {
					updatedCoinData[nameCoin].lowPrice = currentPrice;
				}

				if (
					updatedCoinData[nameCoin].highPrice === null ||
					updatedCoinData[nameCoin].highPrice < currentPrice
				) {
					updatedCoinData[nameCoin].highPrice = currentPrice;
				}

				if (updatedCoinData[nameCoin].markPrice !== null) {
					const priceChange24h =
						((currentPrice - updatedCoinData[nameCoin].markPrice) /
							updatedCoinData[nameCoin].markPrice) *
						100;
					updatedCoinData[nameCoin].priceChange = priceChange24h.toFixed(2);
				}

				totalVolume += parseFloat(stockObj.q);
				updatedCoinData[nameCoin].volume = totalVolume;
				updatedCoinData[nameCoin].index = totalVolume / 24; // Assuming 24 hours

				return updatedCoinData;
			});
		};

		return () => {
			ws.close();
		};
	}, [nameCoin]);

	const handleSelectChange = (event) => {
		const selectedCoin = event.target.value;
		setNameCoin(selectedCoin);
	};

	const getDataUser = async () => {
		const res = await fetch(`https://server-bitcoin.vercel.app/api/user/${id}`);
		const data = await res.json();
		setDataUser(data);
	};
	useEffect(() => {
		if (id) {
			getDataUser();
		}
	}, [id]);

	const [sellAmount, setSellAmount] = useState(0); // Số lượng coin cần bán
	const [buyAmount, setBuyAmount] = useState(0);

	const handleSellAmountChange = (event) => {
		setSellAmount(event.target.value);
	};
	const handleBuyAmountChange = (event) => {
		setBuyAmount(event.target.value);
	};

	const handleSell = async () => {
		const currentPrice = coinData[nameCoin]?.stockPrice || 0;
		const currentQuantity =
			dataUser.assets?.find((asset) => asset.coinName === nameCoin)?.quantity ||
			0;

		if (parseInt(sellAmount) > currentQuantity) {
			// Sử dụng notification của antd thay vì alert
			notification.error({
				message: "Số lượng coin bán không hợp lệ",
				description:
					"Số lượng coin bán vượt quá số lượng coin hiện có. Vui lòng kiểm tra lại.",
				duration: 3, // Thời gian hiển thị thông báo là 3 giây
			});
			return;
		}

		const transactionData = {
			userId: id,
			coinName: nameCoin,
			quantity: sellAmount,
			amount: currentPrice,
			isPurchase: false,
		};
		console.log(transactionData);
		try {
			const response = await fetch(
				"https://server-bitcoin.vercel.app/api/user/addtransaction",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(transactionData),
				}
			);

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(
					responseData.message || "Không thể thực hiện giao dịch."
				);
			}

			setIsModalOpen(false);
			getDataUser();

			// Sử dụng notification của antd để thông báo thành công
			notification.success({
				message: "Giao dịch thành công",
				description: "Bạn đã bán coin thành công.",
				duration: 3,
			});
		} catch (error) {
			console.error("Lỗi khi bán coin:", error);

			// Sử dụng notification của antd để hiển thị lỗi
			notification.error({
				message: "Giao dịch thất bại",
				description: "Lỗi khi bán coin.",
				duration: 3,
			});
		}
	};

	const handleBuy = async () => {
		// Giả sử giá hiện tại của coin là giá stockPrice từ state coinData
		const currentPrice = coinData[nameCoin]?.stockPrice || 0;
		const amountToBuy = parseFloat(buyAmount);
		const cost = currentPrice * amountToBuy;
		console.log(currentPrice);

		// Kiểm tra số dư
		if (dataUser.balance < cost) {
			notification.error({
				message: "Số dư không đủ",
				description: "Bạn không có đủ số dư để thực hiện giao dịch này.",
				duration: 3,
			});
			return;
		}

		// Tạo yêu cầu mua
		const transactionData = {
			userId: id,
			coinName: nameCoin,
			quantity: amountToBuy,
			amount: currentPrice,
			isPurchase: true,
		};
		console.log(transactionData);

		try {
			const response = await fetch(
				`https://server-bitcoin.vercel.app/api/user/addtransaction`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(transactionData),
				}
			);

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(
					responseData.message || "Không thể thực hiện giao dịch mua."
				);
			}

			// Thông báo thành công
			notification.success({
				message: "Mua thành công",
				description: `Bạn đã mua thành công ${amountToBuy} ${nameCoin.toUpperCase()} với tổng chi phí là ${cost.toLocaleString()} USDT.`,
				duration: 3,
			});

			setIsModalOpenBuy(false); // Đóng modal
			getDataUser(); // Cập nhật lại thông tin người dùng
		} catch (error) {
			console.error("Lỗi khi mua coin:", error);
			notification.error({
				message: "Giao dịch thất bại",
				description: error.message,
				duration: 3,
			});
		}
	};
	console.log(dataUser);
	return (
		<>
			<Modal
				visible={isModalOpen}
				onOk={handleSell}
				onCancel={handleCancel}
				footer={null}
				style={{ background: "#2b3139", color: "#fff" }}>
				<div className='text-[#fff] my-2'>
					<h2>Giao Dịch Bán</h2>
				</div>
				<div className='text-gray-400'>Số lượng coin đang có:</div>
				<div className='text-gray-200'>
					{dataUser.assets?.find((asset) => asset.coinName === nameCoin)
						?.quantity || 0}{" "}
					{nameCoin.toUpperCase()}
				</div>
				{/* Ví dụ số lượng coin đang có */}
				<div className='text-gray-400 mt-4'>Số tiền của coin đó:</div>
				{coinData[nameCoin] && (
					<div className='text-gray-200'>{coinData[nameCoin].stockPrice}</div>
				)}

				<div className='text-gray-400 mt-4'>Số dư khả dụng:</div>
				{dataUser && (
					<div className='text-gray-200'>
						{dataUser.balance.toLocaleString("vi-VN", {
							style: "currency",
							currency: "VND",
						})}
					</div>
				)}

				{/* Ví dụ số tiền tương ứng */}
				<div className='mt-4'>
					<Input
						type='number'
						placeholder='Nhập số lượng cần bán'
						value={sellAmount}
						onChange={handleSellAmountChange}
						style={{ background: "#2b3139", color: "#fff" }}
					/>
				</div>
				<div className='mt-4'>
					<Button
						type='primary'
						onClick={handleSell}
						style={{ background: "#fcd535", color: "#333" }}>
						OK
					</Button>
				</div>
			</Modal>

			<Modal
				visible={isModalOpenBuy}
				onOk={handleBuy}
				onCancel={handleCancelBuy}
				footer={null}
				style={{ background: "#2b3139", color: "#fff" }}>
				<div className='text-[#fff] my-2'>
					<h2>Giao Dịch Mua</h2>
				</div>
				<div className='text-gray-400'>Số lượng coin đang có:</div>
				<div className='text-gray-200'>
					{dataUser.assets?.find((asset) => asset.coinName === nameCoin)
						?.quantity || 0}{" "}
					{nameCoin.toUpperCase()}
				</div>
				{/* Ví dụ số lượng coin đang có */}
				<div className='text-gray-400 mt-4'>Số tiền của coin đó:</div>
				{coinData[nameCoin] && (
					<div className='text-gray-200'>{coinData[nameCoin].stockPrice}</div>
				)}
				<div className='text-gray-400 mt-4'>Số dư khả dụng:</div>
				{dataUser && (
					<div className='text-gray-200'>
						{dataUser.balance.toLocaleString("vi-VN", {
							style: "currency",
							currency: "VND",
						})}
					</div>
				)}

				{/* Ví dụ số tiền tương ứng */}
				<div className='mt-4'>
					<Input
						type='number'
						placeholder='Nhập số lượng cần mua'
						value={buyAmount}
						onChange={handleBuyAmountChange}
						style={{ background: "#2b3139", color: "#fff" }}
					/>
				</div>
				<div className='mt-4'>
					<Button
						type='primary'
						onClick={handleBuy}
						style={{ background: "#fcd535", color: "#333" }}>
						OK
					</Button>
				</div>
			</Modal>

			<div className='flex flex-col sm:flex-row'>
				<div className='w-full sm:w-2/3 flex flex-col'>
					<div className='h-[76px] flex flex-row items-center justify-between bg-[#161a1e] text-gray-100 gap-2 text-xs border-[1px] border-l-0 border-gray-700'>
						<div className='flex flex-col ml-6'>
							<select
								name='coinSelect'
								id='coinSelect'
								className='text-[#fff] bg-[#161a1e] text-[25px] font-bold'
								value={nameCoin}
								onChange={handleSelectChange}>
								<option value='btcusdt'>BTCUSDT</option>
								<option value='bnbusdt'>BNBUSDT</option>
								{/* <option value='bnbusdt'>ETHUSDT</option>
								<option value='bnbusdt'>BCHUSDT</option>
								<option value='bnbusdt'>XRPUSDT</option>
								<option value='bnbusdt'>EOSUSDT</option>
								<option value='bnbusdt'>LTCUSDT</option>
								<option value='bnbusdt'>TRXUSDT</option>
								<option value='bnbusdt'>ETCUSDT</option>
								<option value='bnbusdt'>LINKUSDT</option> */}
							</select>
						</div>
						{coinData[nameCoin] && (
							<div
								className='text-2xl font-medium'
								style={{
									color:
										coinData[nameCoin].stockPrice >=
										coinData[nameCoin].markPrice
											? "#0ecb81"
											: "#f6465d",
								}}>
								{coinData[nameCoin].stockPrice && (
									<p>{Number(coinData[nameCoin].stockPrice).toFixed(1)}</p>
								)}
							</div>
						)}

						<div className='hidden sm:flex flex-col'>
							<span className='text-gray-400'>Giá đánh dấu</span>
							<span className='font-medium'>
								{coinData[nameCoin] && coinData[nameCoin].markPrice && (
									<p>{Number(coinData[nameCoin].markPrice).toFixed(1)}</p>
								)}
							</span>
						</div>
						<div className='hidden sm:flex flex-col'>
							<span className='text-gray-400'>Chỉ số</span>
							<span className='font-medium'>
								{coinData[nameCoin] && coinData[nameCoin].index && (
									<p>{Number(coinData[nameCoin].index).toFixed(1)}</p>
								)}
							</span>
						</div>

						<div className='hidden sm:flex flex-col'>
							<span className='text-gray-400'>Biến động giá 24h</span>
							<span className='font-medium text-[#0ecb81]'>
								{coinData[nameCoin] && coinData[nameCoin].priceChange && (
									<p>{Number(coinData[nameCoin].priceChange).toFixed(1)} %</p>
								)}
							</span>
						</div>

						<div className='hidden sm:flex flex-col'>
							<span className='text-gray-400'>Giá cao nhất 24h</span>
							<span className='font-medium'>
								{coinData[nameCoin] && coinData[nameCoin].highPrice && (
									<p>{Number(coinData[nameCoin].highPrice).toFixed(1)}</p>
								)}
							</span>
						</div>
						<div className='hidden sm:flex flex-col'>
							<span className='text-gray-400'>Giá thấp nhất 24h</span>
							<span className='font-medium'>
								{coinData[nameCoin] && coinData[nameCoin].lowPrice && (
									<p>{Number(coinData[nameCoin].lowPrice).toFixed(1)}</p>
								)}
							</span>
						</div>
						<div className='hidden sm:flex flex-col'>
							<span className='text-gray-400'>KL 24h(BTC)</span>
							<span className='font-medium'>
								{coinData[nameCoin] && coinData[nameCoin].volume && (
									<p>{Number(coinData[nameCoin].volume).toFixed(1)}</p>
								)}
							</span>
						</div>

						<div className='text-lg p-4 cursor-pointer text-gray-500'>
							<FaAlignRight />
						</div>
					</div>

					<div className='bg-[#2b313a] sm:h-[90vh] h-[40vh]'></div>
				</div>

				<div className='w-full sm:w-1/3 flex flex-col sm:flex-row'>
					<div className='bg-[#161a1e] border-t-[1px] border-gray-700 border-b-2 sm:w-1/2 w-full sm:pb-0 pb-4'>
						<div className='flex flex-col px-4 bg-[#161a1e] border-t-[1px] border-gray-700'>
							<div className='flex flex-row justify-between items-center'>
								<span className='text-sm text-gray-200 font-medium'>
									Sổ lệnh
								</span>
								<div className='text-lg p-4 pr-0 cursor-pointer text-gray-500'>
									<FaAlignRight />
								</div>
							</div>
							<div className='flex flex-row items-center justify-between mt-2'>
								<div className='flex flex-row items-center gap-4 text-white text-lg'>
									<FaArrowDownWideShort />
									<FaArrowUpShortWide />
									<FaArrowUpRightDots />
								</div>
								<div className='flex flex-row items-center gap-2'>
									<span className='text-gray-200 font-medium text-sm'>0.1</span>
									<FaAngleDown className='text-xs text-gray-400' />
								</div>
							</div>
							<div className='flex flex-row justify-between mt-4'>
								<div className='text-xs font-medium text-gray-400'>
									<span className='font-normal'>Giá (USDT)</span>
									<ul className='pt-3 flex flex-col gap-1 text-[#f6465d]'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
								<div className='text-xs font-medium text-gray-400'>
									<span className='font-normal'>Kích cỡ (BTC)</span>
									<ul className='ml-7 pt-3 flex flex-col gap-1'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
								<div className='text-xs font-medium text-gray-400'>
									<span className='font-normal'>Tổng (BTC)</span>
									<ul className='ml-5 pt-3 flex flex-col gap-1'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
							</div>

							<div className='text-2xl text-[#f6465d] font-medium flex flex-row gap-2 items-center mt-2'>
								<span>69696.9</span> <FaArrowUp className='text-base' />
								<span className='text-gray-400 text-xs font-medium'>
									69696.9
								</span>
							</div>
							<div className='flex flex-row justify-between '>
								<div className='text-xs font-medium text-gray-400'>
									<ul className='pt-3 flex flex-col gap-1 text-[#0ecb81]'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
								<div className='text-xs font-medium text-gray-400'>
									<ul className='ml-7 pt-3 flex flex-col gap-1'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
								<div className='text-xs font-medium text-gray-400'>
									<ul className='ml-5 pt-3 flex flex-col gap-1'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
							</div>
						</div>
						<div className='border-gray-700 border-t-2 mt-2 px-4 pt-2'>
							<span className='text-sm text-gray-200 font-medium'>
								Giao dịch
							</span>
							<div className='flex flex-row justify-between pt-2'>
								<div className='text-xs font-medium text-gray-400'>
									<span className='font-normal'>Giá (USD)</span>
									<ul className='pt-3 flex flex-col gap-1 text-[#f6465d]'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
								<div className='text-xs font-medium text-gray-400'>
									<span className='font-normal'>Số</span>
									<ul className='ml-7 pt-3 flex flex-col gap-1'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
								<div className='text-xs font-medium text-gray-400'>
									<span className='font-normal'>Thời gian</span>
									<ul className='ml-5 pt-3 flex flex-col gap-1'>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
										<li>696969</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className='w-full sm:w-1/2 bg-[#1e2329] border-t-[1px] border-l-[1px] border-gray-700 px-4 text-gray-200 flex flex-col gap-4'>
						<div className='flex flex-row gap-2 justify-between items-center'>
							<div className='w-[40%] flex items-center justify-center bg-[#474d57] rounded-sm text-xs font-medium py-1'>
								<span>Cross</span>
							</div>
							<div className='w-[40%] flex items-center justify-center bg-[#474d57] rounded-sm text-xs font-medium py-1'>
								<span>20x</span>
							</div>
							<div className='text-lg p-4 pr-0 cursor-pointer w-[20%] text-gray-500'>
								<FaAlignRight />
							</div>
						</div>
						<div className='flex flex-row items-center justify-between gap-2 text-sm text-gray-400'>
							<span className='text-[#f0b90b]'>Giới hạn </span>
							<span>Thị trường</span>
							<span>Story</span>
							<FaCircleInfo />
						</div>
						<div className='flex flex-row justify-between items-center'>
							<span className='text-gray-400 text-xs'>
								Số dư khả dụng :
								<span className='text-gray-200 text-xs font-medium'>
									{(dataUser?.balance ?? 0).toLocaleString("vi-VN", {
										style: "currency",
										currency: "VND",
									})}
								</span>
							</span>
							<div className='text-gray-400'>
								<FaLightbulb />
							</div>
						</div>
						<div className='flex flex-row items-center gap-2'>
							<div className='w-[80%] flex flex-row justify-between items-center p-2 bg-[#2b3139] rounded-sm'>
								<span className='text-gray-400 font-medium text-sm'>Giá</span>
								<span className='text-gray-200 font font-medium text-sm'>
									{coinData[nameCoin] && coinData[nameCoin].stockPrice}
								</span>
							</div>
							<div className='w-[20%] p-2 text-gray-200 font font-medium text-sm flex items-center justify-center bg-[#2b3139] rounded-sm'>
								<span>BBO</span>
							</div>
						</div>
						{/* <div className='flex flex-row justify-between items-center p-2 rounded-sm bg-[#2b3139]'>
							<span className='text-gray-400 font-medium text-sm'>
								Số lượng
							</span>
							<span className='text-gray-200 font font-medium text-sm'>
								0% BTC
							</span>
						</div> */}
						{/* <ProgressBar
							completed={60}
							height='14px'
							labelSize='12px'
							bgColor='#474d57'
						/> */}
						{!email && !id ? (
							<>
								<Link
									to='/login'
									className='flex items-center justify-center rounded-md w-full bg-[#fcd535] text-gray-800 text-sm font-medium py-3 cursor-pointer'>
									<span>Đăng nhập</span>
								</Link>
								<Link
									to='/signup'
									className='flex items-center justify-center rounded-md w-full bg-[#474d57] text-gray-200 text-sm font-medium py-3 cursor-pointer'>
									<span>Đăng ký</span>
								</Link>
							</>
						) : (
							<>
								<div
									onClick={showModal}
									className='flex items-center justify-center rounded-md w-full bg-[#fcd535] text-gray-800 text-sm font-medium py-3 cursor-pointer'>
									<span>Bán</span>
								</div>
								<div
									onClick={showModalBuy}
									className='flex items-center justify-center rounded-md w-full bg-[#fcd535] text-gray-800 text-sm font-medium py-3 cursor-pointer'>
									<span>Mua</span>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default TradingView;
