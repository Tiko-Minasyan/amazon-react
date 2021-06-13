import { Button, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import addressApi from "../../../api/address.api";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router";

const useStyles = makeStyles({
	flex: {
		display: "flex",
		flexWrap: "wrap",
	},
	addDiv: {
		border: "2px dashed #c7c7c7",
		width: "290px",
		height: "250px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		fontSize: "30px",
		margin: "20px",
		cursor: "pointer",
	},
	addIcon: {
		fontSize: "60px",
		color: "#a7a7a7",
	},
	addressDiv: {
		border: "1px solid #c7c7c7",
		width: "290px",
		height: "250px",
		display: "flex",
		flexDirection: "column",
		margin: "20px",

		"& p": {
			padding: "0 15px",
			margin: "3px 0",
		},

		"& div": {
			marginLeft: "10px",
			marginTop: "10px",
		},

		"& button": {
			fontSize: "12px",
		},
	},
	default: {
		borderBottom: "1px solid #c7c7c7",
		paddingBottom: "5px !important",
		fontSize: "16px",
		fontWeight: "bold",
		marginBottom: 0,
	},
});

export default function Address() {
	const [addresses, setAddresses] = React.useState([]);

	const classes = useStyles();
	const history = useHistory();

	const getAddresses = () => {
		addressApi.getAddresses().then((res) => {
			setAddresses(res.data);
		});
	};

	useEffect(getAddresses, []);

	const addAddress = () => {
		history.push("/addAddress");
	};

	const setAsDefault = (id) => {
		addressApi.setAsDefault(id).then(() => getAddresses());
	};

	const edit = (id) => {
		history.push("/addresses/" + id);
	};

	const remove = (id) => {
		addressApi.remove(id).then(() => getAddresses());
	};

	return (
		<div className={classes.flex}>
			<div className={classes.addDiv} onClick={addAddress}>
				<AddIcon className={classes.addIcon} />
				<p>Add Address</p>
			</div>
			{addresses.map((address) => (
				<div className={classes.addressDiv}>
					{address.isDefault && (
						<p className={classes.default}>Default address</p>
					)}
					<p>{address.address1}</p>
					{address.address2 && <p>{address.address2}</p>}
					<p>Country: {address.country}</p>
					<p>City: {address.city}</p>
					{address.state && <p>State: {address.state}</p>}
					{address.zip && <p>Zip code: {address.zip}</p>}
					<div>
						<Button onClick={() => edit(address.id)}>Edit</Button>
						{" | "}
						<Button onClick={() => remove(address.id)}>Remove</Button>
						{!address.isDefault && (
							<>
								{" | "}
								<Button onClick={() => setAsDefault(address.id)}>
									Set As Default
								</Button>
							</>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
