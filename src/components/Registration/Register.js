import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
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
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignUp() {
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [firstNameError, setFirstNameError] = React.useState("");
	const [lastNameError, setLastNameError] = React.useState("");
	const [emailError, setEmailError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
	const history = useHistory();

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

	const onPasswordChange = (e) => {
		setPassword(e.target.value);
		setConfirmPasswordError("");
		setPasswordError("");
	};

	const onConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
		setConfirmPasswordError("");
	};

	const onFormSubmit = (e) => {
		e.preventDefault();
		let isError = false;

		if (!firstName) {
			setFirstNameError("First name is missing!");
			isError = true;
		}
		if (!lastName) {
			setLastNameError("Last name is missing!");
			isError = true;
		}
		if (!email) {
			setEmailError("Email is missing!");
			isError = true;
		} else if (!isEmail(email)) {
			setEmailError("Wrong email format!");
			isError = true;
		}
		if (!password) {
			setPasswordError("Password is missing!");
			isError = true;
		} else if (password.length < 8) {
			setPasswordError("Password has to be at least 8 characters!");
			isError = true;
		} else if (!confirmPassword) {
			setConfirmPasswordError("Please confirm your password!");
			isError = true;
		} else if (confirmPassword !== password) {
			setConfirmPasswordError("Passwords don't match!");
			isError = true;
		}

		if (!isError) {
			userApi.register({ firstName, lastName, email, password }).then((res) => {
				if (res === 409) {
					return setEmailError("This email is already registered!");
				}

				history.push("/login");
			});
		}
	};

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<form className={classes.form} noValidate onSubmit={onFormSubmit}>
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
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								value={email}
								onChange={onEmailChange}
								error={!!emailError}
								helperText={emailError}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
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
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								fullWidth
								name="confirmPassword"
								label="Confirm password"
								type="password"
								id="confirmPassword"
								autoComplete="current-password"
								value={confirmPassword}
								onChange={onConfirmPasswordChange}
								error={!!confirmPasswordError}
								helperText={confirmPasswordError}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign Up
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
							<Link to="/login" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
