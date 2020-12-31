
import {
    useLocation
} from "react-router-dom";

export default function useTitle() {
    const path = useLocation().pathname;
    switch (path) {
        /*
        case "/":
            return "Home";
        case "/Info":
           return "Account's info";
        case "/Login":
            return "Login";
        case "/Signup":
            return "Sign up";
      */
        default:
            return "Caro Online"
    }
}
