import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "yahoo",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER, // tvoj nalog
      to: email,                   // korisnikov email iz forme
      subject: "Reset lozinke",
      text: `Kliknite na link da resetujete lozinku: ${resetLink}`
    });

    res.json({ message: "Reset link poslat na email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri slanju emaila." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Lozinka uspešno resetovana." });
  } catch (err) {
    res.status(400).json({ message: "Token nevažeći ili istekao." });
  }
};
