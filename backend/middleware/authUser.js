import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log(token);

    if (!token) {
      return res.json({ success: true, message: `token${token}` });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store only the ObjectId string
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
