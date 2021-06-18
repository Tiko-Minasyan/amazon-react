import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import productApi from "../../../api/product.api";
import colorApi from "../../../api/color.api";
import categoryApi from "../../../api/category.api";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 275,
		width: 800,
		margin: "auto",
		marginTop: 10,
		position: "relative",
	},
	title: {
		fontWeight: "bold",
		fontSize: 18,
	},
	field: {
		marginBottom: 10,
		width: "48%",

		"&:nth-of-type(even)": {
			marginLeft: "4%",
		},

		"&:nth-of-type(5)": {
			marginTop: "15px",
		},

		"&:nth-of-type(6)": {
			marginTop: "7px",
		},
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
		position: "absolute",
		bottom: 5,
		right: 20,
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
	imgDiv: {
		width: "48%",
		height: "250px",
		marginBottom: 10,
		display: "inline-block",
		position: "relative",

		"&:nth-of-type(even)": {
			marginLeft: "4%",
		},
	},
	img: {
		width: "100%",
		height: "100%",
	},
	default: {
		position: "absolute",
		fontWeight: "bold",
		marginLeft: 10,
		background: "rgba(220, 220, 220, 0.3)",
		padding: 10,
	},
	imgBtn: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		opacity: 0,

		"& button": {
			background: "rgba(220, 220, 220, 0.7)",
			margin: 5,
		},
	},
	imageError: {
		color: "red",
		marginLeft: 10,
	},
}));

export default function EditProduct() {
	const classes = useStyles();
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
	const [published, setPublished] = React.useState(false);
	const [nameError, setNameError] = React.useState("");
	const [descriptionError, setDescriptionError] = React.useState("");
	const [brandError, setBrandError] = React.useState("");
	const [priceError, setPriceError] = React.useState("");
	const [categoryError, setCategoryError] = React.useState("");
	const [colorError, setColorError] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [images, setImages] = React.useState([]);
	const [imageError, setImageError] = React.useState("");

	const history = useHistory();
	const theme = useTheme();
	let { id } = useParams();

	useEffect(() => {
		productApi
			.getProduct(id)
			.then(
				colorApi.getColors().then((res) => {
					setColors(res.data);
				})
			)
			.then(
				categoryApi.getCategories().then((res) => {
					setCategories(res.data);
				})
			)
			.then((res) => {
				setName(res.data.name);
				setDescription(res.data.description);
				setBrand(res.data.brand);
				setPrice(res.data.price);
				setPublished(res.data.published);
				setCategory(res.data.Category.name);
				setCategoryId(res.data.CategoryId);

				let colorsNameArr = [];
				let colorsHelperArr = [];
				res.data.Colors.forEach((color) => {
					colorsNameArr.push(color.name);
					colorsHelperArr.push({
						id: color.id,
						value: color.hex,
					});
				});
				setProductColorHelper(colorsHelperArr);
				setProductColors(colorsNameArr);
			});

		getImages(); // eslint-disable-next-line
	}, []);

	const getImages = () => {
		productApi.getProductImages(id).then((res) => {
			setImages(res.data);
		});
	};

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

	const handleCategoryChange = (e) => {
		setCategory(e.target.value);
		setCategoryError("");
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

	const onCategoryChange = (id) => {
		setCategoryId(id);
	};

	const handleColorChange = (event) => {
		setColorError("");
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
			setColorError("Colors are missing!");
			error = true;
		}

		if (!error) {
			const colors = [];
			productColorHelper.forEach((item) => {
				colors.push(parseInt(item.id));
			});

			productApi
				.editProduct(id, {
					id,
					name,
					description,
					brand,
					price,
					CategoryId: categoryId,
					published,
					colors,
				})
				.then(() => {
					history.push("/myproducts");
				});
		}
	};

	const cancel = () => {
		history.push("/myproducts");
	};

	const deleteProduct = () => {
		productApi.deleteProduct(id).then(() => {
			history.push("/myproducts");
		});
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const visible = (id) => {
		document.getElementById("img" + id).style.opacity = 1;
	};

	const invisible = (id) => {
		document.getElementById("img" + id).style.opacity = 0;
	};

	const makeDefault = (imgId) => {
		productApi.makeDefaultImg(id, imgId).then(() => {
			setImageError("");
			getImages();
		});
	};

	const deleteImg = (imgId) => {
		productApi.deleteImg(id, imgId).then(() => {
			setImageError("");
			getImages();
		});
	};

	const addImage = (e) => {
		const formData = new FormData();
		for (let i = 0; i < e.target.files.length; i++) {
			formData.append("files", e.target.files[i]);
		}

		productApi.addImage(formData, id).then((res) => {
			if (res === 403)
				return setImageError("Product cannot have more than 9 images!");
			getImages();
		});
	};

	return (
		<Card className={classes.root} variant="outlined">
			<CardContent>
				<TextField
					variant="outlined"
					margin="normal"
					className={classes.field}
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
					className={classes.field}
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
					className={classes.field}
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
					className={classes.field}
					label="Price in cents"
					name="price"
					value={price}
					onChange={onPriceChange}
					error={!!priceError}
					helperText={priceError}
				/>
				<FormControl
					variant="outlined"
					className={classes.field}
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
					variant="outlined"
					className={classes.field}
					error={!!colorError}
				>
					<InputLabel id="color-label">Product colors</InputLabel>
					<Select
						multiple
						value={productColors}
						onChange={handleColorChange}
						labelId="color-label"
						label="Product colors"
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
				{images.map((item) => (
					<div
						className={classes.imgDiv}
						onMouseEnter={() => visible(item.id)}
						onMouseLeave={() => invisible(item.id)}
					>
						{item.isDefault && <p className={classes.default}>Default</p>}
						<div className={classes.imgBtn} id={"img" + item.id}>
							<Button
								color="primary"
								variant="outlined"
								onClick={() => makeDefault(item.id)}
							>
								Make default
							</Button>
							<Button
								color="secondary"
								variant="outlined"
								onClick={() => deleteImg(item.id)}
							>
								Delete
							</Button>
						</div>
						<img
							src={`http://localhost:8000/${item.name}`}
							className={classes.img}
							alt=""
						/>
					</div>
				))}
				<br /> <br />
				<Button variant="contained" color="primary" component="label">
					Add images
					<input
						value=""
						type="file"
						multiple
						id="file"
						hidden
						onChange={addImage}
					/>
				</Button>
				<label className={classes.imageError}>{imageError}</label>
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
