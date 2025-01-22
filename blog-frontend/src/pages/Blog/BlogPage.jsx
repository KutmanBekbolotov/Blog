import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Button, TextField, TextareaAutosize, Modal, Box, Typography, Container, Card, CardContent, CardMedia, Grid } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMedia, setNewMedia] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:3000/blogs");
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      console.log("Fetched blogs:", data);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleCreate = async () => {
    if (!newTitle || !newContent) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("content", newContent);
    formData.append("authorId", "1");
    if (newMedia) formData.append("media", newMedia);

    try {
      const response = await fetch("http://localhost:3000/blogs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error("Failed to create blog");
      }

      const newBlog = await response.json();
      console.log("Created blog:", newBlog);

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

  const handleFileChange = (e) => {
    setNewMedia(e.target.files[0]);
  };

  return (
    <Container 
      maxWidth={false}
      sx={{ 
        py: 6, 
        px: { xs: 4, md: 8 },
        maxWidth: '2000px',
        mx: 'auto'
      }}
    >
      <Grid container spacing={6}>
        {blogs.map((blog) => (
          <Grid 
            item 
            xs={12} 
            sm={6}
            lg={4}
            key={blog.id}
            sx={{ minWidth: { md: '400px' } }}
          >
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: 3,
              '&:hover': { boxShadow: 6 },
              minHeight: '500px',
              maxWidth: '800px',
              mx: 'auto'
            }}>
              {blog.mediaUrl && (
                blog.mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                  <CardMedia
                    component="video"
                    height="350"
                    src={`http://localhost:3000${blog.mediaUrl}`}
                    controls
                    sx={{ 
                      objectFit: 'cover',
                      bgcolor: 'black'
                    }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    height="350"
                    image={`http://localhost:3000${blog.mediaUrl}`}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )
              )}
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ mb: 3, fontWeight: 'bold' }}
                >
                  {blog.title}
                </Typography>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <PersonOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                    {blog.author?.email || 'Unknown'}
                  </Typography>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                    {new Date(blog.date).toLocaleString()}
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ mb: 4, fontSize: '1.1rem' }}
                >
                  {blog.content}
                </Typography>
                {isAuthenticated && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDelete(blog.id)}
                    sx={{ mt: 'auto', py: 1, px: 3 }}
                  >
                    Delete
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isAuthenticated && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenModal(true)}
          sx={{ 
            position: 'fixed',
            bottom: 30,
            right: 30,
            borderRadius: '50%',
            width: 64,
            height: 64,
            minWidth: 64
          }}
        >
          +
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
    </Container>
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