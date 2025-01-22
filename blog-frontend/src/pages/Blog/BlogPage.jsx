import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Button, TextField, TextareaAutosize, Modal, Box, Typography } from "@mui/material";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMedia, setNewMedia] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated } = useAuth();

  // Загружаем блоги при аутентификации
  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
  }, [isAuthenticated]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:3000/blogs");
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Обработчик для создания нового блога
  const handleCreate = async () => {
    if (!newTitle || !newContent) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("content", newContent);
    if (newMedia) formData.append("media", newMedia);

    try {
      // Логируем перед отправкой
      console.log("Form Data being sent:", formData);

      const response = await fetch("http://localhost:3000/blogs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create blog");
      }

      fetchBlogs();
      setNewTitle("");
      setNewContent("");
      setNewMedia(null);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("An error occurred while creating the blog.");
    }
  };

  // Обработчик для удаления блога
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred while deleting the blog.");
    }
  };

  // Обработчик выбора файла
  const handleFileChange = (e) => {
    setNewMedia(e.target.files[0]);
  };

  return (
    <div>
      <h2>All Blogs</h2>

      {isAuthenticated && (
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          + Add Post
        </Button>
      )}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="create-blog-modal"
        aria-describedby="create-new-blog"
      >
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" id="create-blog-modal">Create New Blog</Typography>
          <TextField
            label="Title"
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextareaAutosize
            minRows={4}
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ width: "100%", marginBottom: "16px" }}
          />
          <input type="file" onChange={handleFileChange} />
          <div>
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Create Blog
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      {blogs.map((blog) => (
        <div key={blog.id} style={{ marginBottom: "20px" }}>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          {blog.media && (
            <div>
              {blog.media.endsWith(".mp4") || blog.media.endsWith(".avi") ? (
                <video width="400" controls>
                  <source src={blog.media} />
                </video>
              ) : (
                <img src={blog.media} alt="Blog media" width="200" />
              )}
            </div>
          )}
          {/* Ensure that the author field exists */}
          <p>By: {blog.author ? blog.author.email : "Unknown"}</p>
          <p>Posted on: {new Date(blog.date).toLocaleString()}</p>

          {isAuthenticated && (
            <div>
              <Button variant="outlined" color="error" onClick={() => handleDelete(blog.id)}>
                Delete
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: 24,
  width: "400px",
  borderRadius: "8px",
};

export default BlogPage;