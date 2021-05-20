import React, { useEffect } from "react";
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
import axios from "axios";
import Cookies from "universal-cookie";
import axiosSetup from "../axios.setup";

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
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [emailError, setEmailError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const history = useHistory();
	const cookies = new Cookies();
	const classes = useStyles();

	useEffect(() => {
		if (!!cookies.get("token")) {
			axios
				.get("http://localhost:8000/users/profile")
				.then((res) => {
					console.log("You are already logged in!");
					history.push("/profile");
				})
				.catch((e) => {
					console.log("error: ", e.response);
					cookies.remove("token");
				});
		} // eslint-disable-next-line
	}, []);

	const onEmailChange = (e) => {
		setEmail(e.target.value);
		setEmailError("");
	};

	const onPasswordChange = (e) => {
		setPassword(e.target.value);
		setPasswordError("");
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let isError = false;

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
			setPasswordError("Password is too short!");
			isError = true;
		}

		if (!isError) {
			axios
				.post("http://localhost:8000/users/login", {
					email,
					password,
				})
				.then((res) => {
					cookies.set("token", res.data);
					axiosSetup();
					history.push("/profile");
				})
				.catch((e) => {
					if (e.response.status === 404) setEmailError("Email not registered!");
					if (e.response.status === 403) setPasswordError("Wrong password!");
					console.log(e.response.data.message);
				});
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form className={classes.form} noValidate onSubmit={formSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						value={email}
						onChange={onEmailChange}
						error={!!emailError}
						helperText={emailError}
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
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link to="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link to="/register" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
