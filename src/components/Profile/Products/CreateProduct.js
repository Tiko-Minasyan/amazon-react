import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import FormHelperText from "@material-ui/core/FormHelperText";
import colorApi from "../../../api/color.api";
import productApi from "../../../api/product.api";
import categoryApi from "../../../api/category.api";

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
		marginTop: "15px",
	},
}));

export default function CreateProduct() {
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [brand, setBrand] = React.useState("");
	const [price, setPrice] = React.useState("");
	const [category, setCategory] = React.useState("");
	const [categoryId, setCategoryId] = React.useState(0);
	const [colors, setColors] = React.useState([]);
	const [categories, setCategories] = React.useState([]);
	const [productColors, setProductColors] = React.useState([]);
	const [productColorHelper, setProductColorHelper] = React.useState([]);
	const [nameError, setNameError] = React.useState("");
	const [descriptionError, setDescriptionError] = React.useState("");
	const [brandError, setBrandError] = React.useState("");
	const [priceError, setPriceError] = React.useState("");
	const [categoryError, setCategoryError] = React.useState("");
	const [colorError, setColorError] = React.useState("");

	const theme = useTheme();
	const history = useHistory();
	const classes = useStyles();

	const handleChange = (e) => {
		setColorError("");
		setProductColors(e.target.value);
	};
	const handleCategoryChange = (e) => {
		setCategory(e.target.value);
		setCategoryError("");
	};

	useEffect(() => {
		colorApi
			.getColors()
			.then(
				categoryApi.getCategories().then((res) => {
					setCategories(res.data);
				})
			)
			.then((res) => {
				setColors(res.data);
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

	const onCategoryChange = (id) => {
		setCategoryId(id);
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
		if (!category) {
			setCategoryError("Category is missing!");
			isError = true;
		}
		if (productColors.length === 0) {
			setColorError("Colors are missing!");
			isError = true;
		}

		if (!isError) {
			const colors = [];
			productColorHelper.forEach((item) => {
				colors.push(item.id);
			});

			productApi
				.createProduct({
					name,
					description,
					brand,
					price,
					CategoryId: categoryId,
					colors,
				})
				.then(() => {
					history.push("/profile");
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
						label="Product name"
						name="productName"
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
						label="Product description"
						name="description"
						value={description}
						onChange={onDescriptionChange}
						error={!!descriptionError}
						helperText={descriptionError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Product brand"
						name="brand"
						value={brand}
						onChange={onBrandChange}
						error={!!brandError}
						helperText={brandError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						label="Product price (in cents)"
						name="price"
						value={price}
						onChange={onPriceChange}
						error={!!priceError}
						helperText={priceError}
					/>
					<FormControl
						fullWidth
						variant="outlined"
						className={classes.formControl}
						error={!!categoryError}
					>
						<InputLabel id="category-label">Product category</InputLabel>
						<Select
							labelId="category-label"
							id="category"
							value={category}
							onChange={handleCategoryChange}
							label="Product category"
						>
							{categories.map((item) => (
								<MenuItem
									value={item.name}
									key={item.id}
									onClick={() => onCategoryChange(item.id)}
								>
									{item.name}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{categoryError}</FormHelperText>
					</FormControl>
					<FormControl
						fullWidth
						variant="outlined"
						className={classes.formControl}
						error={!!colorError}
					>
						<InputLabel id="color-label">Product colors</InputLabel>
						<Select
							multiple
							labelId="color-label"
							label="Product colors"
							value={productColors}
							onChange={handleChange}
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
									key={color.id}
									id={color.id}
									value={color.name}
									hex={color.hex}
									style={selectColorStyle(color.name, productColors, theme)}
									onClick={optionClick}
								>
									{color.name}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{colorError}</FormHelperText>
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
							<Link to="/myproducts" variant="body2">
								{"Back to my products"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
