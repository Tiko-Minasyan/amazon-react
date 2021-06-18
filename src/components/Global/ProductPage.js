import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Carousel from "react-material-ui-carousel";
import productApi from "../../api/product.api";
import { useHistory, useParams } from "react-router";
import cartApi from "../../api/cart.api";

const useStyles = makeStyles({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	root: {
		width: "100%",
		margin: 10,
		display: "flex",
	},
	chipContainer: {
		margin: "10px 0",
	},
	chip: {
		margin: 3,
	},
	selectedChip: {
		margin: 3,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	cardImg: {
		width: 345,
		height: 230,
	},
});

export default function ProductPage({ addCartNum }) {
	const [product, setProduct] = React.useState({});
	const [images, setImages] = React.useState([]);
	const [colors, setColors] = React.useState([]);
	const [colorId, setColorId] = React.useState(0);

	const classes = useStyles();
	const history = useHistory();
	const { id } = useParams();

	useEffect(() => {
		productApi.getProduct(id).then((res) => {
			setProduct(res.data);
			res.data.Colors.forEach((item, index) => {
				if (index === 0) {
					item.selected = true;
					setColorId(item.id);
				} else item.selected = false;
			});
			setColors(res.data.Colors);
		});

		productApi.getProductImages(id).then((res) => {
			setImages(res.data);
		});
	}, [id]);

	const setChipColor = (hex) => {
		return {
			background: hex,
		};
	};

	const chipClick = (index) => {
		const newColors = [...colors];
		newColors.forEach((color, colorIndex) => {
			if (colorIndex === index) {
				color.selected = true;
				setColorId(color.id);
			} else color.selected = false;
		});
		setColors(newColors);
	};

	const addToCart = () => {
		addCartNum();

		if (!localStorage.token) {
			let cart = JSON.parse(localStorage.getItem("guestCart"));
			if (!cart) cart = {};

			if (cart[id]) {
				cart[id].count += 1;
			} else {
				cart[id] = {};
				cart[id].count = 1;
				cart[id].color = colorId;
			}

			localStorage.guestCart = JSON.stringify(cart);
			history.push("/cart");
		} else {
			cartApi.getCart().then((res) => {
				const cart = res.data;
				let existing = false;

				for (let item of cart) {
					// eslint-disable-next-line
					if (item.Product.id == id) {
						existing = true;
						cartApi.update(item.Product.id, 1).then(() => {
							history.push("/cart");
						});
					}
				}

				if (!existing) {
					cartApi.addCart({ id, colorId }).then(() => {
						history.push("/cart");
					});
				}
			});
		}

		// history.push("/cart");
	};

	return product.name ? (
		<div className={classes.container}>
			<Card className={classes.root} key={product.id}>
				{images.length === 0 ? (
					<CardMedia
						component="img"
						alt="Product image could not be loaded"
						height="200"
						image={
							images.length > 0
								? `http://localhost:8000/${images[0].name}`
								: "http://beepeers.com/assets/images/commerces/default-image.jpg"
						}
						className={classes.cardImg}
					/>
				) : (
					<Carousel
						autoPlay={false}
						animation="slide"
						timeout={{ enter: 200, exit: 200 }}
						navButtonsWrapperProps={{
							style: {
								top: "-20px",
							},
						}}
					>
						{images.map((item, index) => (
							<div key={item + index}>
								<img
									className={classes.cardImg}
									src={`http://localhost:8000/${item.name}`}
									alt=""
								/>
							</div>
						))}
					</Carousel>
				)}
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{product.name}
					</Typography>
					<Typography gutterBottom variant="subtitle1">
						{product.brand}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{product.description}
					</Typography>
					<Typography variant="caption" className={classes.chipContainer}>
						Available colors:
						{colors.map((color, index) => (
							<Chip
								key={color.id}
								label={color.name}
								style={setChipColor(color.hex)}
								onClick={() => chipClick(index)}
								className={color.selected ? classes.selectedChip : classes.chip}
								variant={color.selected ? "outlined" : "default"}
							/>
						))}
					</Typography>
					<Typography variant="subtitle2" component="p">
						Price in cents: {product.price}
					</Typography>
					<Typography variant="body2">
						Category: {product.Category.name}
					</Typography>
				</CardContent>
				<CardActions>
					<Button
						size="small"
						color="primary"
						onClick={() => addToCart(product.id)}
					>
						Add to cart
					</Button>
				</CardActions>
			</Card>
		</div>
	) : (
		<></>
	);
}
