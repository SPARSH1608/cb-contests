
import useMeData from "./useMeData";
import TUser from "../types/TUser";


type ReturnType = {
  status: 'UNAUTHENTICATED',
  me: null
} | {
  status: 'LOADING',
  me: null
} | {
  status: 'AUTHENTICATED',
  me: TUser
}

/**
 * Use this hook to check whether user is logged in or not!!
 */
export default function useSession2(): ReturnType {
  // Mock user object based on the provided data
  const mockUser: TUser = {
    id: "8",
    name: "Sparsh Goel",
    email: "sparshgoelk@gmail.com",
    role_id: 1,
    oauth_id: 1,
    photo: "https://lh3.googleusercontent.com/a/ACg8ocKtvICWY4GprnpXSZLiVf6n-iu3ZnQeNDk5BDhRHCjjvPAY1fOW=s96-c"
    // Add other fields as per the TUser type definition
  };

  return {
    status: 'AUTHENTICATED',
    me: mockUser
  };
}