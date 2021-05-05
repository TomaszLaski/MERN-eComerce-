import AsyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc auth user & get token
// @route   POST /api/users/login
// @access public
const authUser = AsyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("invalid email or password");
	}
});

// @desc register a new user
// @route   POST /api/users/
// @access public
const registerUser = AsyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExist = await User.findOne({ email });

	if (userExist) {
		res.status(400);
		throw new Error("user already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("invalid user data");
	}
});

// @desc Get user profile
// @route   GET /api/users/profile
// @access Private
const getUsersProfile = AsyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("user not found");
	}
});

export { authUser, getUsersProfile, registerUser };
