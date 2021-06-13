import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { isEmail } from "validator";
import userApi from "../../api/user.api";

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

export default function Profile() {
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [oldPassword, setOldPassword] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [firstNameError, setFirstNameError] = React.useState("");
	const [lastNameError, setLastNameError] = React.useState("");
	const [emailError, setEmailError] = React.useState("");
	const [oldPasswordError, setOldPasswordError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		userApi.getProfile().then((res) => {
			setFirstName(res.data.firstName);
			setLastName(res.data.lastName);
			setEmail(res.data.email);
		}); // eslint-disable-next-line
	}, []);

	const onFirstNameChange = (e) => {
		setFirstName(e.target.value);
		setFirstNameError("");
	};

	const onLastNameChange = (e) => {
		setLastName(e.target.value);
		setLastNameError("");
	};

	const onEmailChange = (e) => {
		setEmail(e.target.value);
		setEmailError("");
	};

	const onOldPasswordChange = (e) => {
		setOldPassword(e.target.value);
		setOldPasswordError("");
	};

	const onPasswordChange = (e) => {
		setPassword(e.target.value);
		setPasswordError("");
	};

	const onConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
		setConfirmPasswordError("");
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let error = false;
		let passwordUpdate = false;

		if (!firstName) {
			setFirstNameError("First name is missing!");
			error = true;
		}
		if (!lastName) {
			setLastNameError("Last name is missing!");
			error = true;
		}
		if (!email) {
			setEmailError("Email is missing!");
			error = true;
		} else if (!isEmail(email)) {
			setEmailError("Wrong email format!");
			error = true;
		}

		if (!!oldPassword) {
			passwordUpdate = true;
		}

		if (passwordUpdate) {
			if (!password) {
				setPasswordError("Please write your new password!");
				error = true;
			} else if (password.length < 8) {
				setPasswordError("Pasword must be at least 8 characters long!");
				error = true;
			} else if (!confirmPassword) {
				setConfirmPasswordError("Please confirm your password!");
				error = true;
			} else if (confirmPassword !== password) {
				setConfirmPasswordError("Passwords don't match!");
				error = true;
			}
		}

		if (!error) {
			userApi
				.edit({
					firstName,
					lastName,
					email,
					oldPassword,
					password,
				})
				.then((res) => {
					if (res === 403) return setOldPasswordError("Wrong password!");
					history.push("/profile");
				});
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Edit Account
				</Typography>
				<form className={classes.form} noValidate onSubmit={formSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								name="firstName"
								variant="outlined"
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
								value={firstName}
								onChange={onFirstNameChange}
								error={!!firstNameError}
								helperText={firstNameError}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lname"
								value={lastName}
								onChange={onLastNameChange}
								error={!!lastNameError}
								helperText={lastNameError}
							/>
						</Grid>
					</Grid>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						autoFocus
						name="email"
						label="Email"
						id="email"
						autoComplete="current-email"
						value={email}
						onChange={onEmailChange}
						error={!!emailError}
						helperText={emailError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						autoFocus
						name="oldPassword"
						label="Old password"
						type="password"
						id="oldPassword"
						autoComplete="current-password"
						value={oldPassword}
						onChange={onOldPasswordChange}
						error={!!oldPasswordError}
						helperText={oldPasswordError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						value={password}
						onChange={onPasswordChange}
						error={!!passwordError}
						helperText={passwordError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="confirmPassword"
						label="Confirm pasword"
						type="password"
						id="confirmPassword"
						autoComplete="current-password"
						value={confirmPassword}
						onChange={onConfirmPasswordChange}
						error={!!confirmPasswordError}
						helperText={confirmPasswordError}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Update account
					</Button>
					<Grid container>
						<Grid item>
							<Link to="/profile" variant="body2">
								{"Back to profile"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
