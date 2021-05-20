import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import axios from "axios";

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
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
	formControl: {
		minWidth: 130,
	},
}));

export default function CreateProduct() {
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [brand, setBrand] = React.useState("");
	const [price, setPrice] = React.useState("");
	const [colors, setColors] = React.useState([]);
	const [productColors, setProductColors] = React.useState([]);
	const [productColorHelper, setProductColorHelper] = React.useState([]);
	const [nameError, setNameError] = React.useState("");
	const [descriptionError, setDescriptionError] = React.useState("");
	const [brandError, setBrandError] = React.useState("");
	const [priceError, setPriceError] = React.useState("");
	const [colorError, setColorError] = React.useState(false);
	const theme = useTheme();

	const handleChange = (event) => {
		setColorError(false);
		setProductColors(event.target.value);
	};
	const history = useHistory();

	const classes = useStyles();

	useEffect(() => {
		axios
			.get("http://localhost:8000/colors/")
			.then((res) => {
				setColors(res.data);
			})
			.catch((e) => {
				console.log(e.response);
			});
	}, []);

	function selectColorStyle(name, productColors, theme) {
		return {
			fontStyle: productColors.indexOf(name) !== -1 && "italic",
		};
	}

	function setChipColor(a) {
		return {
			background: productColorHelper[a].value,
		};
	}

	const onNameChange = (e) => {
		setName(e.target.value);
		setNameError("");
	};

	const onDescriptionChange = (e) => {
		setDescription(e.target.value);
		setDescriptionError("");
	};

	const onBrandChange = (e) => {
		setBrand(e.target.value);
		setBrandError("");
	};

	const onPriceChange = (e) => {
		if (
			(parseInt(e.target.value).toString().length === e.target.value.length &&
				e.target.value.length < 10) ||
			e.target.value === ""
		) {
			setPrice(e.target.value);
			setPriceError("");
		}
	};

	const optionClick = (e) => {
		const value = e.target.getAttribute("hex");
		const id = e.target.id;
		const arr = productColorHelper.filter(
			(item) => Object.values(item).indexOf(value) === -1
		);
		if (arr.length < productColorHelper.length) setProductColorHelper(arr);
		else setProductColorHelper([...productColorHelper, { id, value }]);
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let isError = false;

		if (!name) {
			setNameError("Name is missing!");
			isError = true;
		}
		if (!description) {
			setDescriptionError("Description is missing!");
			isError = true;
		}
		if (!brand) {
			setBrandError("Brand is missing!");
			isError = true;
		}
		if (!price) {
			setPriceError("Price is missing!");
			isError = true;
		}
		if (productColors.length === 0) {
			setColorError(true);
			isError = true;
		}

		if (!isError) {
			const colors = [];
			productColorHelper.forEach((item) => {
				colors.push(item.id);
			});

			axios
				.post("http://localhost:8000/products/create", {
					name,
					description,
					brand,
					price,
					colors,
				})
				.then(() => {
					history.push("/profile");
				})
				.catch((e) => {
					console.log(e.response.data.message);
				});
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Create new product
				</Typography>
				<form className={classes.form} noValidate onSubmit={formSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						id="name"
						label="Product name"
						name="name"
						autoFocus
						value={name}
						onChange={onNameChange}
						error={!!nameError}
						helperText={nameError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="description"
						label="Product description"
						id="description"
						value={description}
						onChange={onDescriptionChange}
						error={!!descriptionError}
						helperText={descriptionError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="brand"
						label="Product brand"
						id="brand"
						value={brand}
						onChange={onBrandChange}
						error={!!brandError}
						helperText={brandError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="price"
						label="Product price (in cents)"
						id="price"
						value={price}
						onChange={onPriceChange}
						error={!!priceError}
						helperText={priceError}
					/>
					<FormControl className={classes.formControl} error={!!colorError}>
						<InputLabel>Product colors</InputLabel>
						<Select
							multiple
							value={productColors}
							onChange={handleChange}
							input={<Input id="select-multiple-chip" />}
							renderValue={(selected) => (
								<div className={classes.chips}>
									{selected.map((value, index) => (
										<Chip
											key={value}
											label={value}
											className={classes.chip}
											style={setChipColor(index)}
										/>
									))}
								</div>
							)}
						>
							{colors.map((color) => (
								<MenuItem
									key={color._id}
									id={color._id}
									value={color.name}
									hex={color.hex}
									style={selectColorStyle(color.name, productColors, theme)}
									onClick={optionClick}
								>
									{color.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Create new product
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
