import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/signUp/SignUp";
import Start from "./components/start/Start";
import Explore from "./components/explore/Explore";
import Home from "./components/home/Home";
import Message from "./components/message/Message";
import Search from "./components/Search/Search";
import Profile from "./components/profile/Profile";
import Login from "./components/login/Login";
import StoreState from "./context/StoreState";
import Alert from "./components/alert/Alert";
import Reels from "./components/profile/reels/Reels";
import Post from "./components/profile/post/Post";
import Saved from "./components/profile/saved/Saved";
import Tagged from "./components/profile/tagged/Tagged";
import Reel from "./components/reels/Reel";

function App() {
  return (
    <div>
      <Router>
        <StoreState>
          <Alert />
          <Routes>
            <Route exact path="/*" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/start" element={<Start />}>
              <Route index element={<Navigate to="explore" replace />} />
              <Route exact path="explore" element={<Explore />} />
              <Route exact path="reel" element={<Reel />} />
              <Route exact path="home" element={<Home />} />
              <Route exact path="message" element={<Message />} />
              <Route exact path="profile" element={<Profile />}>
                <Route index element={<Navigate to="post" replace />} />
                <Route exact path="post" element={<Post />} />
                <Route exact path="reels" element={<Reels />} />
                <Route exact path="saved" element={<Saved />} />
                <Route exact path="tagged" element={<Tagged />} />
              </Route>
              <Route exact path="search" element={<Search />} />
            </Route>
          </Routes>
        </StoreState>
      </Router>
    </div>
  );
}

export default App;
