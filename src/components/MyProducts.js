import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Cookies from "universal-cookie";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles({
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
	chip: {
		margin: 4,
		marginLeft: 0,
	},
});

export default function MyProducts() {
	const [products, setProducts] = React.useState([]);
	const classes = useStyles();
	const history = useHistory();
	const cookies = new Cookies();

	useEffect(() => {
		axios
			.get("http://localhost:8000/products/myproducts")
			.then((res) => {
				setProducts(res.data);
			})
			.catch((e) => {
				if (e.response.status === 403) {
					cookies.remove("token");
					history.push("/");
				}

				console.log(e.response.data.message);
			});
		// eslint-disable-next-line
	}, []);

	const editProduct = (e) => {
		history.push("/myproducts/" + e.target.closest("button").id);
	};

	const setChipColor = (hex) => {
		return {
			background: hex,
		};
	};

	return (
		<div>
			<Link to="/profile">Back to profile</Link>
			{products.map((product) => (
				<Card className={classes.root} variant="outlined" key={product._id}>
					<CardContent>
						<Typography className={classes.title} gutterBottom>
							{product.name}
						</Typography>
						<Typography className={classes.pos}>
							Brand: {product.brand}
						</Typography>
						<Typography color="textSecondary" gutterBottom>
							{product.description}
						</Typography>
						<Typography variant="body2" component="p">
							Price in cents: {product.price}
						</Typography>
						{console.log(product)}
						{product.colors.map((value) => (
							<Chip
								label={value.name}
								style={setChipColor(value.hex)}
								className={classes.chip}
							/>
						))}

						<Typography variant="body2" component="p">
							Published: {product.published ? "Yes" : "No"}
						</Typography>
					</CardContent>
					<CardActions>
						<Button size="small" id={product._id} onClick={editProduct}>
							Edit product
						</Button>
					</CardActions>
				</Card>
			))}
		</div>
	);
}
