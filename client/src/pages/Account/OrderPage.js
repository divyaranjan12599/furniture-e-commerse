import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoLight } from "../../assets/images";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../App";


const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { products, totalAmt, shippingCharge } = location.state || {};
    const { userAuth } = useContext(UserContext);

    console.log("Products : ", products)
    const [name, setName] = useState("");
    const email = userAuth.user.email
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        phoneNumber: ""
    });

    const [checked, setChecked] = useState(false);

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        switch (field) {
            case "name":
                setName(value);
                break;
            case "address":
            case "city":
            case "state":
            case "country":
            case "pinCode":
            case "phoneNumber":
                setShippingInfo({ ...shippingInfo, [field]: value });
                break;

            default:
                break;
        }
    };

    async function handlePlaceOrder(e) {
        e.preventDefault();


        const formattedOrderItems = products.map((product) => ({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
            color: product.colors[0],
            size: product.size,
            product: product._id,
        }));

        const paymentInfo = {
            id: "Check",
            status: "success"
        }

        const orderDetails = {
            name,
            email,
            shippingInfo,
            orderItems: formattedOrderItems,
            itemsPrice: totalAmt,
            shippingPrice: shippingCharge,
            totalPrice: totalAmt + shippingCharge,
            paymentInfo
        };

        try {
            const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/orders/new", orderDetails, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success === true) {
                toast.success("Order placed successfully!");
                navigate("/");
            } else {
                toast.error("Failed to place order. Please try again.");
                navigate("/cart");
            }
        } catch (error) {
            console.error("Error placing order: ", error);
            toast.error("Error placing order. Please try again later.");
            navigate("/cart");
        }
    }

    return (
        <div className="w-full h-screen flex items-center justify-start">
            <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
                <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
                    <Link to="/">
                        <img src={logoLight} alt="logoImg" className="w-28" />
                    </Link>
                    <div className="flex flex-col gap-1 -mt-1">
                        <h1 className="font-titleFont text-xl font-medium">
                            Place Your Order
                        </h1>
                        <p className="text-base">Provide your order details</p>
                    </div>
                    <div className="w-[300px] flex items-start gap-3">
                        <span className="text-green-500 mt-1">
                            <BsCheckCircleFill />
                        </span>
                        <p className="text-base text-gray-300">
                            <span className="text-white font-semibold font-titleFont">
                                Quick and Secure Order Processing
                            </span>
                            <br />
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
                <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
                    <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
                        <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                            Order Details
                        </h1>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-0.5">
                                <p className="font-titleFont text-base font-semibold text-gray-600">
                                    Full Name
                                </p>
                                <input
                                    value={name}
                                    onChange={(e) => handleInputChange(e, "name")}
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="text"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="font-titleFont text-base font-semibold text-gray-600">
                                    Email
                                </p>
                                <input
                                    value={email}
                                    disabled
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="email"
                                    placeholder="Your Email"
                                />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="font-titleFont text-base font-semibold text-gray-600">
                                    Shipping Address
                                </p>
                                <input
                                    value={shippingInfo.address}
                                    onChange={(e) => handleInputChange(e, "address")}
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="text"
                                    placeholder="Address"
                                />
                                <input
                                    value={shippingInfo.city}
                                    onChange={(e) => handleInputChange(e, "city")}
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="text"
                                    placeholder="City"
                                />
                                <input
                                    value={shippingInfo.state}
                                    onChange={(e) => handleInputChange(e, "state")}
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="text"
                                    placeholder="State"
                                />
                                <input
                                    value={shippingInfo.country}
                                    onChange={(e) => handleInputChange(e, "country")}
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="text"
                                    placeholder="Country"
                                />
                                <input
                                    value={shippingInfo.pinCode}
                                    onChange={(e) => handleInputChange(e, "pinCode")}
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="number"
                                    placeholder="Pin Code"
                                />
                                <input
                                    value={shippingInfo.phoneNumber}
                                    onChange={(e) => handleInputChange(e, "phoneNumber")}
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="number"
                                    placeholder="Phone Number"
                                />
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <p className="font-titleFont text-base font-semibold text-gray-600">
                                    Shipping Price
                                </p>
                                <input
                                    value={shippingCharge}
                                    disabled
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="number"
                                    placeholder="Shipping Price"
                                />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="font-titleFont text-base font-semibold text-gray-600">
                                    Total Price
                                </p>
                                <input
                                    value={totalAmt + shippingCharge}
                                    disabled
                                    className="w-full h-8 px-4 rounded-md border border-gray-400"
                                    type="number"
                                    placeholder="Total Price"
                                />
                            </div>
                            <button
                                className={`${checked
                                    ? "bg-primeColor"
                                    : "bg-gray-500"} text-white text-base font-semibold font-titleFont h-10 rounded-md mt-3 cursor-pointer`}
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderPage;
