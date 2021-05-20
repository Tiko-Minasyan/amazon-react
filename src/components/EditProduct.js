import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import {
	Chip,
	FormControl,
	Input,
	InputLabel,
	MenuItem,
	Select,
	useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 275,
		width: 400,
		margin: "auto",
	},
	title: {
		fontWeight: "bold",
		fontSize: 18,
	},
	field: {
		marginBottom: 10,
		width: "100%",
	},
	pos: {
		marginBottom: 12,
	},
	cancelBtn: {
		color: theme.palette.secondary.light,
	},
	deleteBtn: {
		color: theme.palette.secondary.dark,
	},
	publish: {
		margin: 0,
	},
	formControl: {
		minWidth: 130,
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
}));

export default function EditProduct(props) {
	const classes = useStyles();
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [brand, setBrand] = React.useState("");
	const [price, setPrice] = React.useState("");
	const [colors, setColors] = React.useState([]);
	const [productColors, setProductColors] = React.useState([]);
	const [productColorHelper, setProductColorHelper] = React.useState([]);
	const [published, setPublished] = React.useState(false);
	const [nameError, setNameError] = React.useState("");
	const [descriptionError, setDescriptionError] = React.useState("");
	const [brandError, setBrandError] = React.useState("");
	const [priceError, setPriceError] = React.useState("");
	const [colorError, setColorError] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const history = useHistory();
	const theme = useTheme();
	let { id } = useParams();

	useEffect(() => {
		axios
			.get("http://localhost:8000/products/" + id)
			.then(
				axios
					.get("http://localhost:8000/colors/")
					.then((res) => {
						setColors(res.data);
					})
					.catch((e) => {
						console.log(e.response);
					})
			)
			.then((res) => {
				setName(res.data.name);
				setDescription(res.data.description);
				setBrand(res.data.brand);
				setPrice(res.data.price);
				setPublished(res.data.published);

				let colorsNameArr = [];
				let colorsHelperArr = [];
				res.data.colors.forEach((color) => {
					colorsNameArr.push(color.name);
					colorsHelperArr.push({
						id: color._id,
						value: color.hex,
					});
				});
				setProductColorHelper(colorsHelperArr);
				setProductColors(colorsNameArr);
			})
			.catch((e) => {
				console.log(e);
				if (e.response.status === 403) history.push("/");
				else console.log(e.response.data.message);
			});
		// eslint-disable-next-line
	}, []);

	function selectColorStyle(name, productColors, theme) {
		return {
			fontStyle: productColors.indexOf(name) !== -1 && "italic",
		};
	}

	function setChipColor(a) {
		if (typeof productColorHelper[a] === "undefined") return;
		return {
			background: productColorHelper[a].value,
		};
	}

	const handleChange = (event) => {
		setPublished(event.target.checked);
	};

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

	const handleColorChange = (event) => {
		setColorError(false);
		setProductColors(event.target.value);
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

	const saveChanges = () => {
		let error = false;

		if (!name) {
			setNameError("Name is missing!");
			error = true;
		}
		if (!description) {
			setDescriptionError("Description is missing!");
			error = true;
		}
		if (!brand) {
			setBrandError("Brand is missing!");
			error = true;
		}
		if (!price) {
			setPriceError("Price is missing!");
			error = true;
		}
		if (productColors.length === 0) {
			setColorError(true);
			error = true;
		}

		if (!error) {
			const colors = [];
			productColorHelper.forEach((item) => {
				colors.push(item.id);
			});
			console.log(productColorHelper);

			axios
				.patch("http://localhost:8000/products/" + id, {
					name,
					description,
					brand,
					price,
					_id: id,
					published,
					colors,
				})
				.then(() => {
					history.push("/myproducts");
				})
				.catch((e) => {
					console.log(e.response);
					if (e.response.status === 403) history.push("/");
				});
		}
	};

	const cancel = () => {
		history.push("/myproducts");
	};

	const deleteProduct = () => {
		axios
			.delete("http://localhost:8000/products/" + id)
			.then(() => {
				history.push("/myproducts");
			})
			.catch((e) => {
				console.log(e.response);
			});
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Card className={classes.root} variant="outlined">
			<CardContent>
				<TextField
					className={classes.field}
					label="Product name"
					value={name}
					onChange={onNameChange}
					error={!!nameError}
					helperText={nameError}
				/>
				<TextField
					className={classes.field}
					label="Product brand"
					value={brand}
					onChange={onBrandChange}
					error={!!brandError}
					helperText={brandError}
				/>
				<TextField
					className={classes.field}
					label="Product description"
					value={description}
					onChange={onDescriptionChange}
					error={!!descriptionError}
					helperText={descriptionError}
				/>
				<TextField
					className={classes.field}
					label="Price in cents"
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
						onChange={handleColorChange}
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
				<br />
				<FormControlLabel
					labelPlacement="start"
					className={classes.publish}
					control={
						<Checkbox
							checked={published}
							onChange={handleChange}
							name="publish"
							color="primary"
						/>
					}
					label="Publish product"
				/>
			</CardContent>
			<CardActions>
				<Button size="small" onClick={saveChanges}>
					Save changes
				</Button>
				<Button size="small" className={classes.cancelBtn} onClick={cancel}>
					Cancel
				</Button>
				<Button
					size="small"
					className={classes.deleteBtn}
					onClick={handleClickOpen}
				>
					Delete product
				</Button>
			</CardActions>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Delete the product?"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure that you want to delete this product? <br /> Warning:
						this action is irreversible!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" autoFocus>
						Cancel
					</Button>
					<Button onClick={deleteProduct} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
}
