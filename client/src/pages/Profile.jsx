import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
      setBio(res.data.bio || "");
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    await api.put("/api/user/profile", { bio });
    alert("Bio updated");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <div className="mt-4">
        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          className="w-full border p-2 rounded"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Bio
      </button>

      <div className="mt-6">
        <h3 className="font-semibold">Profile Completion</h3>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
};

export default Profile;
