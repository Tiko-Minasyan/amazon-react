import "./css/App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { setAuthToken } from "./axios";

import SignIn from "./components/Registration/SignIn";
import Register from "./components/Registration/Register";
import App from "./App";

import Header from "./components/Global/Header";

function AppHeader() {
	setAuthToken();
	const [cartNum, setCartNum] = React.useState(0);

	const addCartNum = (num = 1) => {
		setCartNum(cartNum + num);
	};

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			if (localStorage.getItem("guestCart")) {
				const cart = JSON.parse(localStorage.getItem("guestCart"));
				let num = 0;
				for (let [item] in cart) {
					num += cart[item].count;
				}
				setCartNum(num);
			}
		}
	}, []);

	return (
		<Router>
			<Switch>
				<Route path="/register">
					<Register />
				</Route>
				<Route path="/login">
					<SignIn />
				</Route>
				<Route path="/">
					<Header cartNum={cartNum} />
					<App cartNum={cartNum} addCartNum={addCartNum} />
				</Route>
			</Switch>
		</Router>
	);
}

export default AppHeader;
