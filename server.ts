import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { AppConfig } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Configuration
const DEFAULT_CONFIG: AppConfig = {
  profileTitle: "شاهر",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  description: "نورتو صفحات ازعم واحد من اونريه عصابات ماجيك سيتي اونر عصابه بلاك ليست رساله سريعه للمبعوصين نعلو ولا يعلا علينا وخليكم مبعوصين \nSAFA7 30851 ON_TOOP",
  backgroundImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80",
  musicUrl: "https://www.youtube.com/watch?v=rolD6KVBBO8",
  musicTitle: "موسيقى الواجهة الرسمية",
  tiktokUrl: "https://www.tiktok.com/@tiktok",
  steamUrl: "https://steamcommunity.com/",
  discordUrl: "https://discord.gg/"
};

// Default Authentication
const DEFAULT_AUTH = {
  password: "0592632539" // Default password
};

// Seed config file if it doesn't exist
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf-8");
}

// Seed auth file if it doesn't exist
if (!fs.existsSync(AUTH_FILE)) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(DEFAULT_AUTH, null, 2), "utf-8");
}

// Helper to read configuration
function readConfig(): AppConfig {
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_CONFIG;
  }
}

// Helper to write configuration
function writeConfig(config: AppConfig): boolean {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (err) {
    return false;
  }
}

// Helper to read authentication
function readAuth() {
  try {
    const data = fs.readFileSync(AUTH_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_AUTH;
  }
}

// Helper to write authentication
function writeAuth(auth: any) {
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), "utf-8");
    return true;
  } catch (err) {
    return false;
  }
}

// ----------------------
// API Routes
// ----------------------

// 1. Get Public Configuration (Does not expose passwords)
app.get("/api/config", (req, res) => {
  const config = readConfig();
  res.json({ success: true, data: config });
});

// 2. Authentication Login Check
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const auth = readAuth();
  
  if (password === auth.password) {
    // Return a simple mock token (the password itself can act as a simple validator in subsequent requests)
    res.json({ success: true, message: "تم تسجيل الدخول بنجاح", token: auth.password });
  } else {
    res.status(401).json({ success: false, message: "كلمة المرور غير صحيحة!" });
  }
});

// 3. Update Configuration (requires authentication token)
app.post("/api/config", (req, res) => {
  const token = req.headers.authorization;
  const auth = readAuth();

  if (!token || token !== auth.password) {
    return res.status(403).json({ success: false, message: "غير مصرح لك بتعديل البيانات!" });
  }

  const newConfig: AppConfig = req.body;
  
  // Validate that required fields exist
  if (!newConfig.profileTitle || !newConfig.description) {
    return res.status(400).json({ success: false, message: "الاسم والتفاصيل حقول مطلوبة!" });
  }

  const saved = writeConfig(newConfig);
  if (saved) {
    res.json({ success: true, message: "تم حفظ التعديلات بنجاح!", data: newConfig });
  } else {
    res.status(500).json({ success: false, message: "فشل حفظ التعديلات في ملف التكوين" });
  }
});

// 4. Update Password (requires active session token)
app.post("/api/change-password", (req, res) => {
  const token = req.headers.authorization;
  const auth = readAuth();

  if (!token || token !== auth.password) {
    return res.status(403).json({ success: false, message: "غير مصرح لك بالوصول!" });
  }

  const { oldPassword, newPassword } = req.body;

  if (oldPassword !== auth.password) {
    return res.status(400).json({ success: false, message: "كلمة المرور القديمة غير صحيحة!" });
  }

  if (!newPassword || newPassword.trim().length < 3) {
    return res.status(400).json({ success: false, message: "يجب أن تكون كلمة المرور الجديدة مكونة من 3 أحرف على الأقل!" });
  }

  auth.password = newPassword.trim();
  const saved = writeAuth(auth);
  if (saved) {
    res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح!", token: auth.password });
  } else {
    res.status(500).json({ success: false, message: "فشل تحديث كلمة المرور" });
  }
});

// ----------------------
// Vite Middleware & Static Asset Serving
// ----------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
