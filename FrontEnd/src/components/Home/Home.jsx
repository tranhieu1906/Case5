import MetaData from "../Layouts/MetaData";
import PostsContainer from "./PostsContainer";
import SideBar from "./SideBar/SideBar";

const Home = ({ socket }) => {
  return (
    <>
      <MetaData title="Instagram" />

      <div className="flex h-full md:w-4/5 lg:w-4/6 mt-14 mx-auto">
        <PostsContainer socket={socket} />
        <SideBar />
      </div>
    </>
  );
};

export default Home;
