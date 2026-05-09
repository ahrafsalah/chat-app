
import { apiClient } from "@/api/apiClient";
import UpdataProfile from "@/components/UpdateProfile";
import Loading from "../loading";



const Profile = async () => {
  const { user } = await apiClient.get("/auth/check-auth");
  if (!user) {
    <Loading/>
  }
  
  return (
    <UpdataProfile user={user} />
  );
};
export default Profile;
