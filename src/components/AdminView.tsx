import React, { useState } from "react";
import { AppConfig } from "../types";
import { Save, Lock, LogOut, KeyRound, Globe, User, Image, Music, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

interface AdminViewProps {
  config: AppConfig;
  token: string;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

export default function AdminView({ config, token, onLoginSuccess, onLogout, onUpdateConfig }: AdminViewProps) {
  // Login states
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form states
  const [editedConfig, setEditedConfig] = useState<AppConfig>({ ...config });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" }); // 'success' or 'error'

  // Change password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPwdFields, setShowPwdFields] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: "", type: "" });
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  // Sync edits if prop config changes
  React.useEffect(() => {
    setEditedConfig({ ...config });
  }, [config]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError("الرجاء إدخال كلمة المرور");
      return;
    }

    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setLoginError(data.message || "فشل تسجيل الدخول. كلمة المرور خاطئة!");
      }
    } catch (err) {
      setLoginError("حدث خطأ أثناء الاتصال بالخادم. حاول مجدداً.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify(editedConfig),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSaveMessage({ text: "تم حفظ التعديلات ونشرها بنجاح للزوار!", type: "success" });
        onUpdateConfig(data.data);
      } else {
        setSaveMessage({ text: data.message || "فشل حفظ التعديلات.", type: "error" });
      }
    } catch (err) {
      setSaveMessage({ text: "حدث خطأ أثناء الاتصال بالخادم.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPwdMessage({ text: "الرجاء تعبئة كافة الحقول الخاصة بكلمة المرور الجديدة والقديمة!", type: "error" });
      return;
    }

    setIsChangingPwd(true);
    setPwdMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPwdMessage({ text: "تم تغيير كلمة المرور بنجاح! تم تحديث جلسة العمل الخاصة بك.", type: "success" });
        onLoginSuccess(data.token); // update active token
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => setShowPwdFields(false), 2000);
      } else {
        setPwdMessage({ text: data.message || "فشل تغيير كلمة المرور.", type: "error" });
      }
    } catch (err) {
      setPwdMessage({ text: "حدث خطأ في الاتصال بالخادم.", type: "error" });
    } finally {
      setIsChangingPwd(false);
    }
  };

  // If not logged in, show Password Portal
  if (!token) {
    return (
      <div id="admin-login-wrapper" className="min-h-[80vh] flex items-center justify-center px-4 py-12 direction-rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-black/50 border border-violet-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-violet-500/10 text-center"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-6">
            <Lock className="text-violet-400" size={28} />
          </div>

          <h2 className="text-2xl font-black text-white tracking-wide mb-2">لوحة التحكم الخاصة بي</h2>
          <p className="text-gray-400 text-sm mb-6">
            اشي بخصكاش
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="اشي بخصكاش"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 pl-12 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-all text-center font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-3.5 text-gray-500 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {loginError && (
              <p className="text-rose-500 text-xs font-semibold text-right bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                {loginError}
              </p>
            )}

            <button
              id="submit-login-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard Interface
  return (
    <div id="admin-dashboard" className="max-w-4xl mx-auto px-4 py-8 direction-rtl text-right">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 border border-violet-500/15 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-violet-500/5 mb-10"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
              تعديل الواجهة والحسابات
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              قم بتعديل كافة تفاصيل صفحتك، الروابط، الصور، والصوتيات في الوقت الفعلي.
            </p>
          </div>

          <button
            id="logout-btn"
            onClick={onLogout}
            className="flex items-center gap-2 bg-white/5 hover:bg-rose-500/10 text-gray-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer font-bold"
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </div>

        {/* Saved Alert message */}
        {saveMessage.text && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-sm font-semibold flex items-center gap-2 ${
              saveMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            <span>{saveMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-6">
          {/* section 1: General Info */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-violet-400 flex items-center gap-2 border-b border-white/5 pb-2">
              <User size={16} />
              معلومات الملف التعريفي والوصف
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-xs font-bold mb-2">الاسم / اللقب الرئيسي</label>
                <input
                  type="text"
                  value={editedConfig.profileTitle}
                  onChange={(e) => setEditedConfig({ ...editedConfig, profileTitle: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-bold mb-2">رابط صورتك الشخصية (Avatar)</label>
                <input
                  type="text"
                  value={editedConfig.profileImage}
                  onChange={(e) => setEditedConfig({ ...editedConfig, profileImage: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 text-sm text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2">التفاصيل / النبذة والوصف الكاتبها</label>
              <textarea
                value={editedConfig.description}
                onChange={(e) => setEditedConfig({ ...editedConfig, description: e.target.value })}
                rows={3}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 text-sm"
                placeholder="أدخل التفاصيل والوصف التعريفي الذي يظهر للزوار هنا..."
                required
              />
            </div>
          </div>

          {/* section 2: Media and Visual */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-violet-400 flex items-center gap-2 border-b border-white/5 pb-2">
              <Image size={16} />
              الوسائط وصور الواجهة والموسيقى
            </h3>

            <div>
              <label className="block text-gray-300 text-xs font-bold mb-2">رابط صورة الخلفية للواجهة (Background Image URL)</label>
              <input
                type="text"
                value={editedConfig.backgroundImage}
                onChange={(e) => setEditedConfig({ ...editedConfig, backgroundImage: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 text-sm text-left font-mono"
                placeholder="أدخل رابط صورة كامل للمتصفح"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-xs font-bold mb-2">رابط ملف الأغنية (Background MP3 Music URL)</label>
                <input
                  type="text"
                  value={editedConfig.musicUrl}
                  onChange={(e) => setEditedConfig({ ...editedConfig, musicUrl: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 text-sm text-left font-mono"
                  placeholder="رابط مباشر لملف صوتي ينتهي بـ .mp3"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-bold mb-2">اسم الأغنية / الموسيقى المضافة</label>
                <input
                  type="text"
                  value={editedConfig.musicTitle}
                  onChange={(e) => setEditedConfig({ ...editedConfig, musicTitle: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 text-sm"
                  placeholder="أدخل اسم الأغنية التي ستظهر في المشغل"
                />
              </div>
            </div>
          </div>

          {/* section 3: Links */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-violet-400 flex items-center gap-2 border-b border-white/5 pb-2">
              <Globe size={16} />
              روابط حسابات التواصل الاجتماعي
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TikTok */}
              <div>
                <label className="block text-cyan-400 text-xs font-bold mb-2 flex items-center gap-1.5 justify-end">
                  رابط تيك توك (TikTok)
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </label>
                <input
                  type="text"
                  value={editedConfig.tiktokUrl}
                  onChange={(e) => setEditedConfig({ ...editedConfig, tiktokUrl: e.target.value })}
                  className="w-full bg-black/30 border border-cyan-500/20 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-cyan-500 text-sm text-left"
                  placeholder="https://tiktok.com/@youraccount"
                />
              </div>

              {/* Steam */}
              <div>
                <label className="block text-slate-300 text-xs font-bold mb-2 flex items-center gap-1.5 justify-end">
                  رابط ستيم (Steam)
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                </label>
                <input
                  type="text"
                  value={editedConfig.steamUrl}
                  onChange={(e) => setEditedConfig({ ...editedConfig, steamUrl: e.target.value })}
                  className="w-full bg-black/30 border border-slate-500/20 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-slate-400 text-sm text-left"
                  placeholder="https://steamcommunity.com/id/yourusername"
                />
              </div>

              {/* Discord */}
              <div>
                <label className="block text-indigo-400 text-xs font-bold mb-2 flex items-center gap-1.5 justify-end">
                  رابط ديسكورد (Discord)
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                </label>
                <input
                  type="text"
                  value={editedConfig.discordUrl}
                  onChange={(e) => setEditedConfig({ ...editedConfig, discordUrl: e.target.value })}
                  className="w-full bg-black/30 border border-indigo-500/20 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-indigo-500 text-sm text-left"
                  placeholder="https://discord.gg/yourserver"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            id="save-dashboard-config-btn"
            type="submit"
            disabled={isSaving}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-violet-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isSaving ? "جاري حفظ ونشر التعديلات..." : "حفظ ونشر التعديلات"}
          </button>
        </form>

        {/* Section 4: Security Password Changing */}
        <div className="mt-10 pt-6 border-t border-white/5">
          {!showPwdFields ? (
            <button
              id="show-change-password-fields-btn"
              onClick={() => setShowPwdFields(true)}
              className="text-violet-400 hover:text-violet-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <KeyRound size={14} />
              هل تود تغيير كلمة مرور لوحة التحكم؟
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-violet-950/10 border border-violet-500/20 rounded-2xl p-5 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h4 className="text-sm font-bold text-violet-300 flex items-center gap-1.5">
                  <KeyRound size={16} />
                  تحديث كلمة المرور الأمنية
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowPwdFields(false);
                    setPwdMessage({ text: "", type: "" });
                  }}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  إلغاء
                </button>
              </div>

              {pwdMessage.text && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold ${
                    pwdMessage.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}
                >
                  {pwdMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-gray-300 text-xs font-bold mb-1.5">كلمة المرور القديمة / الحالية</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-violet-500/60 text-sm font-mono text-center"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-xs font-bold mb-1.5">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-violet-500/60 text-sm font-mono text-center"
                    required
                  />
                </div>

                <button
                  id="submit-change-password-btn"
                  type="submit"
                  disabled={isChangingPwd}
                  className="w-full md:col-span-2 bg-violet-700 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                >
                  <KeyRound size={12} />
                  {isChangingPwd ? "جاري التغيير..." : "تأكيد وتغيير كلمة المرور"}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
