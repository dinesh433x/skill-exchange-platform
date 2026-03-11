import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
        setBio(res.data.bio || "");
      } catch (error) {
        console.error(
          "Failed to fetch user:",
          error.response?.data || error.message,
        );
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setIsSaving(true);

    try {
      await api.put("/api/user/profile", { bio });

      setUser((prev) => ({
        ...prev,
        bio,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Failed to update bio:",
        error.response?.data || error.message,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setBio(user.bio || "");
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateCompletion = () => {
    let completed = 0;

    if (user?.name) completed++;
    if (user?.email) completed++;
    if (user?.bio) completed++;
    if (user?.skillsOffered?.length > 0) completed++;

    return Math.round((completed / 4) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600">
        <div className="w-full px-6 py-9">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-4xl font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getInitials(user.name)}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.name}
              </h1>
              <p className="text-blue-100 text-lg">{user.email}</p>
            </div>

            {/* Stats */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {user.skillsOffered.length || 0}
                </div>
                <div className="text-sm text-blue-100">Skills Offered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {user.skillsWanted.length || 0}
                </div>
                <div className="text-sm text-blue-100">Skills Wanted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {completion}%
                </div>
                <div className="text-sm text-blue-100">Profile Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-35 resize-none text-gray-700"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell others about yourself, your interests, and what you're passionate about..."
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  {user.bio ? (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">
                      No bio added yet. Click edit to add your bio and tell
                      others about yourself.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Skills Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Offered */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0"
                        />
                      </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900">
                      Skills I Can Teach
                    </h3>
                  </div>
                </div>

                {user.skillsOffered.length > 0 ? (
                  <div className="space-y-2">
                    {user.skillsOffered.map((skillObj) => (
                      <div
                        key={skillObj.id}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <span className="font-medium text-gray-900">
                          {skillObj.name}
                        </span>

                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                          {skillObj.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-2">
                      No skills added yet
                    </p>

                    <button
                      onClick={() => navigate("/skills")}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Add Skills →
                    </button>
                  </div>
                )}
              </div>

              {/* Skills Wanted */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13"
                        />
                      </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900">
                      Skills I Want to Learn
                    </h3>
                  </div>
                </div>

                {user.skillsWanted.length > 0 ? (
                  <div className="space-y-2">
                    {user.skillsWanted.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-3 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <span className="font-medium text-gray-900">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-2">
                      No skills added yet
                    </p>

                    <button
                      onClick={() => navigate("/skills")}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      Add Skills →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Completion Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Completion
              </h3>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{completion}% Complete</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              {/* Completion Checklist */}
              <div className="space-y-3">
                {/* Name */}
                <div className="flex items-center gap-2">
                  <span>{user.name ? "☑" : "☐"}</span>

                  <span
                    className={`text-sm ${
                      user.name ? "text-gray-400 line-through" : "text-gray-800"
                    }`}
                  >
                    Add your name
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <span>{user.email ? "☑" : "☐"}</span>

                  <span
                    className={`text-sm ${
                      user.email
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    Add your email
                  </span>
                </div>

                {/* Bio */}
                <div className="flex items-center gap-2">
                  <span>{user.bio ? "☑" : "☐"}</span>

                  <span
                    className={`text-sm ${
                      user.bio ? "text-gray-400 line-through" : "text-gray-800"
                    }`}
                  >
                    Update your bio
                  </span>
                </div>

                {/* Skills */}
                <div className="flex items-center gap-2">
                  <span>{user.skillsWanted.length > 0 ? "☑" : "☐"}</span>

                  <span
                    className={`text-sm ${
                      user.skillsWanted.length > 0
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    Add your skills
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
