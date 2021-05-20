import axios from "axios";
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Profile() {
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	const history = useHistory();
	const cookies = new Cookies();

	useEffect(() => {
		axios
			.get("http://localhost:8000/users/profile")
			.then((res) => {
				console.log(res);
				setFirstName(res.data.firstName);
				setLastName(res.data.lastName);
			})
			.catch((e) => {
				if (e.response.status === 403) {
					cookies.remove("token");
					history.push("/");
				}
				console.log(e);
			});
		// eslint-disable-next-line
	}, []);

	const logout = () => {
		cookies.remove("token");
	};

	return firstName ? (
		<div>
			<h1>
				Welcome back, {firstName} {lastName}!
			</h1>
			<Link to="/dashboard">Dashboard</Link> <br />
			<Link to="/create">Create product</Link> <br />
			<Link to="/myproducts">View your products</Link> <br />
			<Link to="/edit">Edit account</Link> <br />
			<Link to="/" onClick={logout}>
				Logout
			</Link>
		</div>
	) : (
		<></>
	);
}
