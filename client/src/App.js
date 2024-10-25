import { createBrowserRouter, RouterProvider, Outlet, createRoutesFromElements, Route, ScrollRestoration } from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import { createContext, useEffect, useState } from "react";
import { ProductProvider } from "./contexts/ProductContext";
import { lookInSession } from "./pages/Sessions/session";
import toast, { Toaster } from "react-hot-toast";
import OrderPage from "./pages/Account/OrderPage";

export const UserContext = createContext({});

const Layout = () => {
	return (
		<div>
			<Header />
			<HeaderBottom />
			<SpecialCase />
			<ScrollRestoration />
			<Outlet />
			<Footer />
			<FooterBottom />
		</div>
	);
};
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/" element={<Layout />}>
				{/* ==================== Header Navlink Start here =================== */}
				<Route index element={<Home />}></Route>
				<Route path="/shop" element={<Shop />}></Route>
				<Route path="/about" element={<About />}></Route>
				<Route path="/contact" element={<Contact />}></Route>
				<Route path="/journal" element={<Journal />}></Route>
				{/* ==================== Header Navlink End here ===================== */}
				<Route path="/offer" element={<Offer />}></Route>
				<Route path="/product/:_id" element={<ProductDetails />}></Route>
				<Route path="/cart" element={<Cart />}></Route>
				<Route path="/paymentgateway" element={<Payment />}></Route>
			</Route>
			<Route path="/order" element={<OrderPage />}></Route>
			<Route path="/signup" element={<SignUp />}></Route>
			<Route path="/signin" element={<SignIn />}></Route>
		</Route>
	)
);

function App() {



	const [userAuth, setUserAuth] = useState({});
	const [loading, setLoading] = useState(true);
	const [verified, setVerified] = useState(false);

	useEffect(() => {
		let userInSession = lookInSession("user");
		if (userInSession) {
			setUserAuth(JSON.parse(userInSession));
		} else {
			setUserAuth({ access_token: null });
		}
		setLoading(false);
	}, []);

	return (
		<UserContext.Provider value={{ userAuth, setUserAuth, loading }}>
			<ProductProvider>
				<div className="font-bodyFont">
					<RouterProvider router={router} />

					<Toaster
						position="top-center"
						toastOptions={{
							duration: 3000,
						}}
					/>
				</div>
			</ProductProvider>
		</UserContext.Provider>
	);
}

export default App;
