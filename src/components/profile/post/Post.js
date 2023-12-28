import React, { useContext, useEffect, useState } from "react";
import "./post.css";
import storeContext from "../../../context/store";
import Spinner from "../../spinner/Spinner";

const Post = () => {
  const context = useContext(storeContext);
  const { userToken, setAlertMessage, setTotalUserPost, setSpinner } = context;

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [imagesPath, setImagesPath] = useState([]);

  //making POST request to upload a post
  const handleSubmit = async (e) => {
    setSpinner(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedPhoto);
    if (selectedPhoto) {
      const response = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/image/postimage`,
        {
          method: "POST",
          headers: {
            "auth-token": userToken,
          },
          body: formData,
        }
      );
      const json = await response.json();
      setSpinner(false);
      setAlertMessage(json.message);
      setSelectedPhoto(null);
      getAllUserPost();
    } else {
      setSpinner(false);
      setAlertMessage("please select a photo");
    }
  };

  // making request to fetch all the imgaes uploaded by user
  const getAllUserPost = async () => {
    setSpinner(true);
    try {
      const request = await fetch(
        `${process.env.REACT_APP_PORT_URI}/api/image/userimages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        }
      );
      const response = await request.json();
      setSpinner(false);
      setImagesPath(response.allImages);
      setTotalUserPost(response.allImages.length);
    } catch (error) {
      setSpinner(false);
      console.log("getalluserpost error", error);
    }
    setSpinner(false);
  };

  //making DELETE request to delete the post
  const deletePostImage = async (data) => {
    setSpinner(true);
    const imageId = data._id;
    const request = await fetch(
      `${process.env.REACT_APP_PORT_URI}/api/image/deleteimage`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
        body: JSON.stringify({ imageId }),
      }
    );
    const response = await request.json();
    setSpinner(false);
    setAlertMessage(response.message);
    getAllUserPost();
  };

  useEffect(() => {
    getAllUserPost();
  }, []);

  return (
    <>
      <div className="post_container">
        <div className="post_cards">
          {imagesPath.length === 0
            ? ""
            : imagesPath.map((element) => {
                return (
                  <div className="post_card" key={element._id}>
                    <div
                      className="post_card_delete"
                      onClick={() => deletePostImage(element)}
                    >
                      <i className="fa-solid fa-trash-arrow-up"></i>
                    </div>
                    <img src={`${element.photo}`} alt="userPost" />
                  </div>
                );
              })}
          <div className="post_card">
            <div className="post_card_center">
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="post_card_form"
              >
                <label htmlFor="post-file-upload" className="post_card_label">
                  <input
                    id="post-file-upload"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="photo"
                    onChange={(e) => setSelectedPhoto(e.target.files[0])}
                  />
                  <i className="fa-solid fa-plus"></i>
                </label>
                <button className="post_card_upload" type="submit">
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
