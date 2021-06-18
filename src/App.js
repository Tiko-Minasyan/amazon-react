import "./css/App.css";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Profile from "./components/Profile/Profile";
import Edit from "./components/Profile/Edit";
import CreateProduct from "./components/Profile/Products/CreateProduct";
import MyProducts from "./components/Profile/Products/MyProducts";
import Address from "./components/Profile/Addresses/Address";
import AddAddress from "./components/Profile/Addresses/AddAddress";
import EditAddress from "./components/Profile/Addresses/EditAddress";
import EditProduct from "./components/Profile/Products/EditProduct";
import MyOrders from "./components/Profile/MyOrders";
import Dashboard from "./components/Global/Dashboard";
import Search from "./components/Global/Search";
import Cart from "./components/Global/Cart";
import ProductPage from "./components/Global/ProductPage";
import Checkout from "./components/Checkout";

function App({ cartNum, addCartNum }) {
	return (
		<Switch>
			<Route path="/" exact={true}>
				<Dashboard />
			</Route>
			<Route path="/search">
				<Search />
			</Route>
			<Route path="/cart">
				<Cart cartNum={cartNum} addCartNum={addCartNum} />
			</Route>
			<Route path="/products/:id">
				<ProductPage addCartNum={addCartNum} />
			</Route>

			<Route path="/checkout">
				<Checkout addCartNum={addCartNum} />
			</Route>

			<Route path="/profile">
				<Profile />
			</Route>
			<Route path="/edit">
				<Edit />
			</Route>
			<Route path="/create">
				<CreateProduct />
			</Route>
			<Route path="/myproducts" exact={true}>
				<MyProducts />
			</Route>
			<Route path="/myproducts/:id">
				<EditProduct />
			</Route>
			<Route path="/addresses" exact={true}>
				<Address />
			</Route>
			<Route path="/addresses/:id">
				<EditAddress />
			</Route>
			<Route path="/addAddress">
				<AddAddress />
			</Route>
			<Route path="/myorders">
				<MyOrders />
			</Route>

			<Route path="/">
				<Redirect to="/" />
			</Route>
		</Switch>
	);
}

export default App;
