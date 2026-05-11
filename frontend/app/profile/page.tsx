
import { apiClient } from "@/api/apiClient";
import UpdataProfile from "@/components/UpdateProfile";
import Loading from "../loading";



const Profile = async () => {
  try {
    const { user } = await apiClient.get("/auth/check-auth");

    console.log("Fetched user data:", user); // Debug logss

    if (!user) return <Loading />;

    return <UpdataProfile user={user} />;
  } catch (error) {
    return <p>Error loading profile</p>;
  }
};

export default Profile;