const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ===== FILE STORAGE =====
const upload = multer({ storage: multer.memoryStorage() });

// ===== FILE FIELDS =====
const uploadFields = upload.fields([
  { name: "gst_reg", maxCount: 1 },
  { name: "gst_portal", maxCount: 1 },
  { name: "gst_acc", maxCount: 1 },
  { name: "cheque", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "gst3b", maxCount: 10 },
]);

// ===== EMAIL SETUP =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lilliving02@gmail.com",
    //pass: "lkxcpunmfyapfwtr", // 🔴 replace this
	pass: process.env.EMAIL_PASS,
  },
});

// ===== API =====
app.post("/submit", uploadFields, async (req, res) => {
  try {
    const { name, phone, email, vendor } = req.body;

    let attachments = [];

	if (req.files) {
	  Object.keys(req.files).forEach((field) => {
		req.files[field].forEach((file) => {
		  attachments.push({
			filename: file.originalname,
			content: file.buffer,
		  });
		});
	  });
	}

    await transporter.sendMail({
      from: "lilliving02@gmail.com",
      to: "lilliving02@gmail.com",
      subject: "New Vendor Submission",
      text: `
Name: ${name}
Phone: ${phone}
Email: ${email}
Vendor: ${vendor}
      `,
      attachments: attachments,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ===== START SERVER =====
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running at http://localhost:5000");
});