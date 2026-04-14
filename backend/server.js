const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// ===== FILE STORAGE =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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
    pass: "lkxcpunmfyapfwtr", // 🔴 replace this
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
            path: file.path,
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
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});