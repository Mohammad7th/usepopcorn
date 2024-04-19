import { useState } from "react";
import WatchedBox from "./WatchedBox";
import ListBox from "./ListBox";


export default function Main({ children }) {

    return (
        <main className="main">
            {children}
        </main>
    )
}