import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, IconButton, CircularProgress, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Favorite, Comment, Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

interface Image {
  id: bigint;
  title: string;
  category: string;
  url: string;
  likes: bigint;
  comments: string[];
}

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const result = await backend.getImages();
      setImages(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  const handleLike = async (id: bigint) => {
    try {
      await backend.likeImage(id);
      fetchImages();
    } catch (error) {
      console.error('Error liking image:', error);
    }
  };

  const handleComment = async (id: bigint, comment: string) => {
    try {
      await backend.addComment(id, comment);
      fetchImages();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpload = async (data: { title: string; category: string; url: string }) => {
    try {
      await backend.uploadImage(data.title, data.category, data.url);
      setOpenUploadDialog(false);
      reset();
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) {
    return (
      <Container className="flex items-center justify-center h-screen">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pixel
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className="py-8">
        <Grid container spacing={4}>
          {images.map((image) => (
            <Grid item key={image.id.toString()} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image.url}
                  alt={image.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {image.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {image.category}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleLike(image.id)}>
                    <Favorite />
                  </IconButton>
                  <Typography>{Number(image.likes)}</Typography>
                  <IconButton>
                    <Comment />
                  </IconButton>
                  <Typography>{image.comments.length}</Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenUploadDialog(true)}
      >
        <Add />
      </Fab>
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <form onSubmit={handleSubmit(handleUpload)}>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogContent>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: 'Category is required' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth margin="normal" error={!!error}>
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    <MenuItem value="Nature">Nature</MenuItem>
                    <MenuItem value="City">City</MenuItem>
                    <MenuItem value="Abstract">Abstract</MenuItem>
                  </Select>
                  {error && <Typography color="error">{error.message}</Typography>}
                </FormControl>
              )}
            />
            <Controller
              name="url"
              control={control}
              defaultValue=""
              rules={{ required: 'URL is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Image URL"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default App;