import { useState } from "react";
import Logo from "./Logo";
import Search from "./Search";
export default function NavBar({ children }) {

    return (
        <nav className="nav-bar">
            <Logo />
            
            {children}
        </nav>
    )
}