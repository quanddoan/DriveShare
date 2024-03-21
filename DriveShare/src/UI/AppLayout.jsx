import { Footer } from "./Footer"
import { Header } from "./Header"
import {Outlet} from "react-router-dom"
export const AppLayout = () => {
    return(
        <div className="w-screen h-screen ">
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    )
}
