import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription, // Not used for error message, can be removed if not used elsewhere
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Icons } from "@/components/ui/icons"; // Keep if you plan to add icons (e.g., Google icon)
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext";
import { UserLogIn } from "@/types";
// Image imports seem unused in this component, consider removing if not needed for this specific view
// import image1 from "@/assets/images/image1.jpg";
// import image2 from "@/assets/images/image2.jpg";
// import image3 from "@/assets/images/image3.jpg";
// import image4 from "@/assets/images/image4.jpg";
import { Label } from "@/components/ui/label"; // Assuming you use Shadcn's Label, otherwise @radix-ui/react-label
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

interface ILoginProps {}
const initialValue: UserLogIn = {
  email: "",
  password: "",
};

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const { googleSignIn, logIn } = useUserAuth();
  const navigate = useNavigate();
  const [userLogInInfo, setUserLogInInfo] = // Renamed for convention
    React.useState<UserLogIn>(initialValue);
  const [error, setError] = React.useState<string | null>(null); // State for the error message
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // State for loading indicator

  // Generic input handler to update state and clear errors
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserLogInInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));
    if (error) {
      setError(null); // Clear error when user starts typing
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);
    try {
      await googleSignIn();
      navigate("/"); // Or to a specific post-login page
    } catch (err: any) { // Catching 'any' for simplicity, can be more specific (e.g., FirebaseError)
      console.error("Google Sign-In Error: ", err);
      let message = "Failed to sign in with Google. Please try again.";
      // Firebase often provides error codes
      if (err.code) {
        switch (err.code) {
          case "auth/popup-closed-by-user":
            message = "Google Sign-In process was cancelled.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your internet connection.";
            break;
          // Add more specific Firebase error codes here if needed
          default:
            message = err.message || message; // Use Firebase's message if available
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Correct event type for form onSubmit
    e.preventDefault();
    setError(null); // Clear previous errors

    // Basic validation
    if (!userLogInInfo.email || !userLogInInfo.password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      console.log("The user info is : ", userLogInInfo);
      await logIn(userLogInInfo.email, userLogInInfo.password);
      navigate("/"); // Or to a specific post-login page
    } catch (err: any) { // Catching 'any' for simplicity
      console.error("Email/Password Login Error: ", err);
      let message = "Login failed. Please check your credentials.";
      // Firebase often provides error codes for login failures
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential": // More recent Firebase versions use this for wrong email/password
            message = "Invalid email or password. Please try again.";
            break;
          case "auth/invalid-email":
            message = "The email address is not properly formatted.";
            break;
          case "auth/user-disabled":
            message = "This user account has been disabled.";
            break;
          case "auth/network-request-failed":
            message = "Network error. Please check your internet connection.";
            break;
          // Add more specific Firebase error codes here
          default:
            message = err.message || message; // Use Firebase's message if available
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 w-screen h-screen flex justify-center items-center p-4"> {/* Added p-4 for small screens */}
      {/* Removed one layer of flex container for simplicity, outer div handles centering */}
      <div className="w-full max-w-sm"> {/* Ensured max-width for the card */}
        <Card className="rounded-xl shadow-lg"> {/* Added shadow-lg for better depth if desired */}
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center mb-2"> {/* Adjusted margin */}
                Cemetery Admin
              </CardTitle>
              {/* Optional CardDescription if you want to add it back
              <CardDescription className="text-center">
                Sign in to manage your account
              </CardDescription>
              */}
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Error Notification Area */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm" role="alert">
                  <p>{error}</p>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email" // id is important for the generic handler
                  type="email"
                  placeholder="name@example.com" // Standard placeholder
                  value={userLogInInfo.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required // Added basic HTML5 validation
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password" // id is important for the generic handler
                  type="password"
                  placeholder="Password"
                  value={userLogInInfo.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required // Added basic HTML5 validation
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4"> {/* Added gap for spacing */}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging In..." : "Login"}
              </Button>

              {/* "Or continue with" divider */}
              <div className="relative my-1"> {/* Adjusted margin */}
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or contact anthony.virgin@gmail.com
                  </span>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;