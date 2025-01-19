import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from "react-icons/md";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  // Get User Info
  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // Set user info if data exists
        setUserInfo(response.data.user);
      }
    }
    catch (error) {
      if (error.response.status === 401) {
        // Clear storage if unauthorized
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all travel blogs
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-blogs");
      if (response.data && response.data.stories) {
        // Set all travel stories if data exists
        setAllStories(response.data.stories);
      }
    }
    catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  //Handle Edit Story Click
  const handleEdit = (data) =>{}

  // Handle Travel Story Click
  const handleViewStory = (data) => {}

  // Handle Update Favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try{
      const response = await axiosInstance.put("/update-is-favourite/" + storyId,
        { isFavourite: !storyData.isFavourite, }
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories();
      }
    }catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  
    return () => {}
  }, []);
  

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard 
                      key={item._id} 
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <>Empty Card here</>
            )}
          </div>

          <div className="w-[320px]"></div>
        </div>
      </div>

      <button className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10" 
        onClick={() => { 
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
      }}>
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  )
}
  
export default Home;