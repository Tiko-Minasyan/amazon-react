import React, { useEffect } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import userApi from "../../api/user.api";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import ShoppingCart from "@material-ui/icons/ShoppingCartOutlined";
import SearchIcon from "@material-ui/icons/Search";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import categoryApi from "../../api/category.api";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	drawer: {
		width: "250px",
		background: "#3f51b5",
		color: "#e0e0e0",
		height: "100%",
	},
	title: {
		flexGrow: 1,
	},
	pointer: {
		cursor: "pointer",
	},
	profile: {
		fontSize: "large",
		marginRight: "10px",

		"&:hover": {
			border: "1px solid",
		},
	},
	name: {
		marginRight: "10px",
	},
	cart: {
		fontSize: "large",
		width: "140px",

		"&:hover": {
			border: "1px solid",
		},
	},
	cartIcon: {
		fontSize: "25px !important",
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		width: "700px",
		display: "flex",
		alignItems: "center",
	},
	searchBtn: {
		color: "inherit",
		position: "absolute",
		right: 0,
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
		transition: theme.transitions.create("width"),
		width: "420px",
	},
	select: {
		paddingLeft: "5px",
	},
}));

export default function Header({ cartNum }) {
	const [user, setUser] = React.useState({ firstName: "", lastName: "" });
	const [guest, setGuest] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [searchText, setSearchText] = React.useState("");
	const [category, setCategory] = React.useState("All");
	const [categories, setCategories] = React.useState([]);
	const [categoryId, setCategoryId] = React.useState(-1);
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const open = Boolean(anchorEl);

	const classes = useStyles();
	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);

	useEffect(() => {
		categoryApi.getCategories().then((res) => {
			setCategories(res.data);

			if (query.get("text")) setSearchText(query.get("text"));
			else setSearchText("");
		});
		if (!!localStorage.getItem("token")) {
			userApi.getProfile().then((res) => {
				if (typeof res !== "number") setUser(res.data);
			});
		} else {
			setGuest(true);
		} // eslint-disable-next-line
	}, []);

	useEffect(() => {
		setCategory("All");
		setCategoryId(-1);

		const queryCategory = query.get("category");
		categories.forEach((item) => {
			// eslint-disable-next-line
			if (item.id == queryCategory) {
				setCategory(item.name);
				setCategoryId(item.id);
			}
		}); // eslint-disable-next-line
	}, [categories]);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const toggleDrawer = (open) => (event) => {
		setDrawerOpen(open);
	};

	const onSearchTextChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleCategoryChange = (e) => {
		setCategory(e.target.value);
	};

	const onCategoryChange = (id) => {
		setCategoryId(id);
	};

	const login = () => {
		history.push("/login");
	};

	const register = () => {
		history.push("/register");
	};

	const dashboard = () => {
		history.push("/");
	};

	const myProducts = () => {
		history.push("/myproducts");
	};

	const addresses = () => {
		history.push("/addresses");
	};

	const orders = () => {
		history.push("/myorders");
	};

	const profile = () => {
		handleClose();
		history.push("/profile");
	};

	const logout = () => {
		localStorage.removeItem("token");
		window.location.href = "/";
	};

	const search = () => {
		if (categoryId === -1 && !searchText) return history.push("/");

		if (!searchText) return history.push(`/search?category=${categoryId}`);
		if (categoryId === -1) return history.push(`/search?text=${searchText}`);

		history.push(`/search?category=${categoryId}&text=${searchText}`);
	};

	const cart = () => {
		history.push("/cart");
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					{!guest && (
						<IconButton
							aria-haspopup="true"
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={toggleDrawer(true)}
						>
							<MenuIcon />
						</IconButton>
					)}

					<Drawer
						anchor="left"
						open={drawerOpen}
						onClose={toggleDrawer(false)}
						onClick={toggleDrawer(false)}
					>
						<div className={classes.drawer}>
							<List>
								<ListItem button onClick={dashboard}>
									<ListItemText primary="Dashboard" />
								</ListItem>
								<ListItem button onClick={myProducts}>
									<ListItemText primary="My Products" />
								</ListItem>
								<ListItem button onClick={addresses}>
									<ListItemText primary="My Addresses" />
								</ListItem>
								<ListItem button onClick={orders}>
									<ListItemText primary="My Orders" />
								</ListItem>
							</List>
						</div>
					</Drawer>

					<Typography variant="h6" className={classes.title}>
						<span className={classes.pointer} onClick={dashboard}>
							Amazon
						</span>
					</Typography>
					<div className={classes.search}>
						<Select
							labelId="category-label"
							id="category"
							value={category}
							onChange={handleCategoryChange}
							label="Product category"
							className={classes.select}
							disableUnderline
						>
							<MenuItem value="All" onClick={() => onCategoryChange(-1)}>
								All Categories
							</MenuItem>
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

						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ "aria-label": "search" }}
							value={searchText}
							onChange={onSearchTextChange}
						/>
						<Button
							startIcon={<SearchIcon />}
							className={classes.searchBtn}
							onClick={search}
						>
							Search
						</Button>
					</div>
					<div>
						<Button
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
							endIcon={<AccountCircle />}
							className={classes.profile}
						>
							<span>
								{guest ? "Guest" : user.firstName + " " + user.lastName}
							</span>
						</Button>
						<Button
							className={classes.cart}
							color="inherit"
							startIcon={<ShoppingCart className={classes.cartIcon} />}
							onClick={cart}
						>
							Cart ({cartNum})
						</Button>
					</div>
				</Toolbar>
			</AppBar>

			<Menu
				id="menu-appbar"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={open}
				onClose={handleClose}
			>
				{guest
					? [
							<MenuItem onClick={login} key={1}>
								Sign in
							</MenuItem>,
							<MenuItem onClick={register} key={2}>
								Sign up
							</MenuItem>,
					  ]
					: [
							<MenuItem onClick={profile} key={3}>
								Profile
							</MenuItem>,
							<MenuItem onClick={logout} key={4}>
								Logout
							</MenuItem>,
					  ]}
			</Menu>
		</div>
	);
}
