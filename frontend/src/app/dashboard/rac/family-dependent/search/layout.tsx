import { auth } from "@/auth";

const SearchEmployeeLayout = async ({ children }: { children }) => {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }
  return <div className="pt-4">{children}</div>;
};

export default SearchEmployeeLayout;
