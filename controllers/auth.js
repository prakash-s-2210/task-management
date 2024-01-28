import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js"

/* REGISTER USER */
/**
 * Registers a new user in the database.
 * Hashes the password and saves the user object in the database.
 * Returns the saved user object in the response.
 */
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      phoneNumber
    } = req.body;

    const user = await User.findOne({ email });
    if (user) return res.status(400).json( "Email already exists. Please use a different email." );

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      phoneNumber
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* LOGGING IN */

/**
 * Logs in an existing user.
 * Finds the user with the given email in the database.
 * Compares the hashed password with the provided password.
 * If the password matches, generates a JWT token and sends it in the response along with the user object.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).json("Invalid email or password.");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid email or password.");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ token, userObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};