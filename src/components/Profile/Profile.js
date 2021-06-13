import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import userApi from "../../api/user.api";

export default function Profile() {
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");

	useEffect(() => {
		userApi.getProfile().then((res) => {
			setFirstName(res.data.firstName);
			setLastName(res.data.lastName);
		});
		// eslint-disable-next-line
	}, []);

	return (
		<div>
			<h1>
				Welcome back, {firstName} {lastName}!
			</h1>
			<Link to="/edit">Edit account</Link> <br />
		</div>
	);
}
