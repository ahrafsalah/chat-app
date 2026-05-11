
import { apiClient } from "@/api/apiClient";
import UpdataProfile from "@/components/UpdateProfile";
import Loading from "../loading";



const Profile = async () => {
  try {
    const { user } = await apiClient.get("/auth/check-auth");

    if (!user) return <Loading />;

    return <UpdataProfile user={user} />;
  } catch (error) {
    return <div>Error loading profile</div>;
  }
};

export default Profile;