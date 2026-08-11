import { useState, useEffect, useContext, useRef } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Pencil,
  RefreshCw,
  AlertCircle,
  ShoppingCart,
  Heart,
  Package,
  Receipt,
  Camera,
  Loader2,
} from "lucide-react";
import { ShopContext } from "../components/context/ShopContext.jsx";
import { getProfile, uploadAvatar} from "../services/ProfileService.jsx";
// Note: your service also exports `updateProfile` (PATCH /api/auth/update-profile).
// This page doesn't call it directly — that's presumably wired up inside
// EditProfileModal already — so it isn't imported here.
import EditProfileModal from "../components/editprofileModal.jsx";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "");
  return initials.join("") || "?";
};

// Basic client-side guardrails before we ever hit the network.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function SkeletonCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 animate-pulse ${className}`}>
      <div className="h-4 w-1/3 bg-gray-100 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-[#f0f7f3] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#0f3d2e]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 font-medium mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, comingSoon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0f3d2e]/5">
      <div className="w-9 h-9 rounded-xl bg-[#f0f7f3] flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-[#0f3d2e]" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      {comingSoon ? (
        <p className="text-sm font-medium text-gray-300 mt-1">Coming Soon</p>
      ) : (
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      )}
    </div>
  );
}

// Renders the user's photo when one exists (`profileImage`, or a live
// preview blob while an upload is in flight). Falls back to a clean
// initials avatar otherwise — same visual language, just larger and
// dressed up per the new design spec (border + soft shadow).
function Avatar({ name, imageUrl }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Reset the "failed" flag whenever the source changes (e.g. new preview,
  // or a fresh URL after upload) so a previous broken-image state doesn't stick.
  useEffect(() => {
    setImgFailed(false);
  }, [imageUrl]);

  if (imageUrl && !imgFailed) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setImgFailed(true)}
        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg shadow-[#0f3d2e]/10"
      />
    );
  }

  return (
    <div className="w-full h-full rounded-full bg-[#0f3d2e] text-white flex items-center justify-center text-3xl font-semibold tracking-wide border-4 border-white shadow-lg shadow-[#0f3d2e]/10">
      {getInitials(name)}
    </div>
  );
}

export default function Profile() {
  const { cart } = useContext(ShopContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // --- Profile image upload state ---
  const [previewUrl, setPreviewUrl] = useState(null); // instant local preview (object URL)
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null); // tracked separately so cleanup works even after state resets

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Revoke any outstanding preview object URL on unmount to avoid leaking memory.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSaved = (updatedProfile) => {
    setProfile((prev) => ({ ...prev, ...updatedProfile }));
    showToast("Profile updated successfully.");
  };

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
  };

const handleFileChange = async (e) => {
  const file = e.target.files?.[0];

  // Allow selecting the same file again
  e.target.value = "";

  if (!file) return;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    showToast("Please choose a JPG, PNG, WEBP, or GIF image.");
    return;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    showToast("Image is too large. Please choose an image under 5MB.");
    return;
  }

  // Show instant preview
  const preview = URL.createObjectURL(file);
  objectUrlRef.current = preview;
  setPreviewUrl(preview);

  setUploading(true);

  try {
const formData = new FormData();
formData.append("avatar", file);

    // Upload image
    const response = await uploadAvatar(formData);

    // Support different backend response shapes
    const imageUrl =
      response?.data?.profileImage ||
      response?.profileImage ||
      response?.data?.imageUrl ||
      response?.imageUrl ||
      null;

    if (imageUrl) {
      setProfile((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    }

    showToast("Profile picture updated successfully.");
  } catch (err) {
    showToast(
      err?.response?.data?.message ||
      "Failed to upload profile picture."
    );
  } finally {
    clearPreview();
    setUploading(false);
  }
};

  const displayedImage = previewUrl || profile?.profileImage;

  return (
    <div className="bg-[#F7F5F0] min-h-screen font-[Poppins]">
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Profile</h1>

        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard className="md:col-span-2" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center max-w-md mx-auto animate-[riseIn_0.3s_ease-out]">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm text-gray-600">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-5 inline-flex items-center gap-2 bg-[#0f3d2e] hover:bg-[#154d3b] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="grid md:grid-cols-3 gap-6 animate-[riseIn_0.35s_ease-out]">

            {/* LEFT COLUMN */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center h-fit transition-all duration-300 hover:shadow-lg hover:shadow-[#0f3d2e]/5">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 group">
                <Avatar name={profile.name} imageUrl={displayedImage} />

                {/* Uploading overlay */}
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}

                {/* Camera icon — opens the file picker to upload a new photo */}
                <button
                  onClick={handleAvatarEditClick}
                  disabled={uploading}
                  aria-label="Change profile photo"
                  title="Change profile photo"
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#0f3d2e] border-2 border-white shadow-md flex items-center justify-center text-white hover:bg-[#154d3b] transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Edit-profile-details trigger — unchanged behavior, moved to the
                    top-right corner of the now-larger avatar so it doesn't collide
                    with the new camera button below it. */}
                <button
                  onClick={() => setEditOpen(true)}
                  aria-label="Edit profile"
                  title="Edit profile"
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-[#F7F5F0] shadow-sm flex items-center justify-center text-[#0f3d2e] hover:bg-[#0f3d2e] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mt-4">{profile.name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{profile.email}</p>

              <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider bg-[#f0f7f3] text-[#0f3d2e] px-3 py-1 rounded-full">
                {profile.role}
              </span>

              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:col-span-2 space-y-6">

              {/* ACCOUNT INFORMATION */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#0f3d2e]/5">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Account Information</h3>
                <div className="mt-2">
                  <InfoRow icon={User} label="Full Name" value={profile.name} />
                  <InfoRow icon={Mail} label="Email" value={profile.email} />
                  <InfoRow icon={ShieldCheck} label="Role" value={profile.role} />
                  <InfoRow icon={ShieldCheck} label="Account Status" value="Active" />
                  <InfoRow icon={Calendar} label="Member Since" value={formatDate(profile.createdAt)} />
                </div>
              </div>

              {/* QUICK STATISTICS */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Quick Statistics</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
                  <StatCard icon={Receipt} label="Orders" comingSoon />
                  <StatCard icon={ShoppingCart} label="Cart Items" value={cart.reduce((sum, item) => sum + Number(item?.qty || 1), 0)} />
                  <StatCard icon={Package} label="Total Purchases" comingSoon />
                </div>
              </div>

              {/* RECENT ACTIVITY */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#0f3d2e]/5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <div className="text-center py-8">
                  <p className="text-sm text-gray-300 font-medium">Coming Soon</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSaved={handleSaved}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] bg-[#0f3d2e] text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg animate-[fadeSlide_0.25s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}