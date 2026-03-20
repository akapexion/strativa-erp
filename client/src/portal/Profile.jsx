import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  UserCircle,
  Briefcase,
  GraduationCap,
  Calendar,
  Building2,
  UserCog,
  Mail,
  Phone,
  CreditCard,
  Cake,
  Heart,
  Camera,
  KeyRound,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ✅ Use _id from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const employeeId = storedUser?.user_id;

  const [profile, setProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // ✅ Fetch Profile from backend
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/profile/${employeeId}`
      );
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (employeeId) fetchProfile();
  }, [employeeId]);

  // ✅ Upload Image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setImageLoading(true);

    try {
      const formData = new FormData();
      formData.append("employee_image", file);

      await axios.put(
        `http://localhost:5000/profile/${employeeId}/upload-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      fetchProfile(); // refresh image
    } catch (err) {
      console.error(err);
      setImagePreview(null);
    } finally {
      setImageLoading(false);
    }
  };

  

  // ✅ Handle avatar image: filename or full URL
  const avatarSrc =
    imagePreview ||
    (profile?.user_image
      ? profile.user_image.startsWith("http")
        ? profile.user_image
        : `http://localhost:5000/uploads/${profile.user_image}`
      : "http://localhost:5000/uploads/default.png");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div className="h-24 bg-blue-100" />
          <div className="px-8 pb-6 flex items-end gap-6 -mt-12">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white">
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-600 p-1 text-white rounded"
              >
                {imageLoading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Camera size={14} />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div>
              <h2 className="text-xl font-bold">{profile?.user_fullname}</h2>
              <p className="text-sm text-gray-500">{profile?.user_designation}</p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <section className="bg-white rounded-xl border border-gray-300 p-6">
          <h2 className="font-bold mb-4">Personal Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <p>
              <b>Email:</b> {profile?.user_email}
            </p>
            <p>
              <b>Code:</b> {profile?.user_code}
            </p>
          </div>
        </section>

        {/* Employment */}
        <section className="bg-white rounded-xl border border-gray-300 p-6">
          <h2 className="font-bold mb-4">Employment</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <p>
              <b>Designation:</b> {profile?.user_designation}
            </p>
            <p>
              <b>Role:</b> {profile?.user_role}
            </p>
          </div>
        </section>

       
      </main>
    </div>
  );
};

export default Profile;