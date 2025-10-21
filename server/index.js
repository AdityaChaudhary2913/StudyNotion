const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");
const walletRoutes = require("./routes/Wallet");

const { connectDB } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

//Database connection
connectDB();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors())

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

//Cloudinary connection
cloudinaryConnect();

//Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1", contactRoutes);
app.use("/api/v1/wallet", walletRoutes);

app.get('/', (req, res) => {
  return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`)
})