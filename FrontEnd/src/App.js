import {Route, Routes} from "react-router-dom";
// import io from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";
import {lazy, Suspense} from 'react';


import Header from "./components/NavBar/Header";
import ForgotPassword from "./components/User/ForgotPassword";
import PrivateRoute from "./Router/PrivateRouter";

const SignUp = lazy(() => import('./components/User/SignUp'));
const Login = lazy(() => import('./components/User/Login'));
const Home = lazy(() => import('./components/Home/Home'));

// import ViewChat from "./components/Chats/ViewChat";
// const socket = io.connect("http://localhost:8080");


function App() {
    const dispatch = useDispatch();
    const {isAuthenticated} = useSelector((state) => state.user);
    return (
        <>
            {isAuthenticated && <Header />}
            <Suspense>
                <Routes>
                    <Route path="/register" element={<SignUp/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/password/forgot" element={<ForgotPassword/>}/>
                    <Route path="/" element={
                        <Home />
                        // <PrivateRoute>
                        //
                        // </PrivateRoute>
                    }/>
                    {/* <Route path="/chat" element={<ViewChat socket={socket}/>} /> */}
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
