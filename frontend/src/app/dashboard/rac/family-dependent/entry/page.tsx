import { auth } from "@/auth";
import FormRegisterFamily from "./components/formRegisterFamily";

const Dashboard = async () => {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <FormRegisterFamily />
    </div>
  );
};

export default Dashboard;
