import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.cookie("jwt", token, {
        httpOnly: true, // prevent cross-site scripting attacks
        maxAge: 24 * 60 * 60 * 1000 * 15,
        sameSite: "strict", // prevents the browser from sending this cookie along with cross-site requests
        secure: process.env.NODE_ENV !== "development",
    });
}

export default generateTokenAndSetCookie;