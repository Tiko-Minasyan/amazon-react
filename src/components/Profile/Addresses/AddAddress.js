import React from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import addressApi from "../../../api/address.api";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function AddAddress() {
	const [address1, setAddress1] = React.useState("");
	const [address2, setAddress2] = React.useState("");
	const [country, setCountry] = React.useState("");
	const [city, setCity] = React.useState("");
	const [state, setState] = React.useState("");
	const [zip, setZip] = React.useState("");
	const [isDefault, setIsDefault] = React.useState(false);
	const [addressError, setAddressError] = React.useState("");
	const [countryError, setCountryError] = React.useState("");
	const [cityError, setCityError] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	const handleChange = (event) => {
		setIsDefault(event.target.checked);
	};

	const onAddress1Change = (e) => {
		setAddress1(e.target.value);
		setAddressError("");
	};

	const onAddress2Change = (e) => {
		setAddress2(e.target.value);
	};

	const onCountryChange = (e) => {
		setCountry(e.target.value);
		setCountryError("");
	};

	const onCityChange = (e) => {
		setCity(e.target.value);
		setCityError("");
	};

	const onStateChange = (e) => {
		setState(e.target.value);
	};

	const onZipChange = (e) => {
		setZip(e.target.value);
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let error = false;

		if (!address1) {
			setAddressError("Address is missing!");
			error = true;
		}
		if (!country) {
			setCountryError("Country is missing!");
			error = true;
		}
		if (!city) {
			setCityError("City is missing!");
			error = true;
		}

		if (!error) {
			addressApi
				.addAddress({
					address1,
					address2,
					country,
					city,
					state,
					zip,
					isDefault,
				})
				.then(() => {
					history.push("/addresses");
				});
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Add a new address
				</Typography>
				<form className={classes.form} noValidate onSubmit={formSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Address line 1"
						name="address1"
						autoFocus
						value={address1}
						onChange={onAddress1Change}
						error={!!addressError}
						helperText={addressError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Address line 2"
						name="address2"
						value={address2}
						onChange={onAddress2Change}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Country"
						name="country"
						value={country}
						onChange={onCountryChange}
						error={!!countryError}
						helperText={countryError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="City"
						name="city"
						value={city}
						onChange={onCityChange}
						error={!!cityError}
						helperText={cityError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="State"
						name="state"
						value={state}
						onChange={onStateChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Zip code"
						name="zip"
						value={zip}
						onChange={onZipChange}
					/>
					<FormControlLabel
						labelPlacement="end"
						control={
							<Checkbox
								checked={isDefault}
								onChange={handleChange}
								name="publish"
								color="primary"
							/>
						}
						label="Set as default address"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Add new address
					</Button>
					<Grid container>
						<Grid item>
							<Link to="/addresses" variant="body2">
								{"Back to addresses"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
