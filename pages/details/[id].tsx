import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Modal,
  TextField,
  Paper,
  SxProps,
  Theme,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { exampleActions, useAppSelector } from "../../redux";
import Reviews from "../../components/reviewCard";
import { Movie, Review } from "../../types"; // Ensure you define these types in your project
import { fetchMovies, allReview } from "../../redux/slices/example/slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const style: SxProps<Theme> = {
  p: 4,
  top: "50%",
  left: "50%",
  width: "100%",
  boxShadow: 24,
  height: "400px",
  display: "flex",
  maxWidth: "500px",
  borderRadius: "8px",
  alignItems: "center",
  flexDirection: "column",
  bgcolor: "background.paper",
  position: "absolute",
  transform: "translate(-50%, -50%)",
};

const primary = "#1976d2";
interface FetchData {
  Search: Movie[];
  // Add other properties of fetchData as needed
}

const ProductPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { reviewData, fetchData } = useAppSelector((state) => state.example);

  const { id } = router.query;
  const [idx, setIdx] = useState<string | undefined>(undefined);
  const [selectMovie, setSelectMovie] = useState<Movie | undefined>(undefined);
  const [openShipping, setOpenShipping] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectComment, setSelectComment] = useState<string | undefined>(
    undefined
  );
  const [preComment, setPreComment] = useState<string | undefined>(undefined);
  const [addReview, setAddReview] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState<string>("");
  const [showText, setShowText] = useState(false);

  const totalComments = reviewData?.filter(
    (item) => item.imdbId === id
  )?.length;

  useEffect(() => {
    dispatch(fetchMovies() as any);
  }, [dispatch]);

  useEffect(() => {
    if (fetchData?.Search) {
      const findSelectedMovie = fetchData.Search.find(
        (item: { imdbID: string | string[] | undefined }) => item.imdbID === id
      );
      setSelectMovie(findSelectedMovie);
    }
  }, [fetchData, id]);

  const handleClose = () => {
    setOpen(false);
    setReviewText("");
  };

  const handleToggleShipping = () => {
    setOpenShipping(!openShipping);
  };

  const addReviewFunc = () => {
    setReviewText("");

    const newReview: Review = {
      imdbId: id as string,
      comment: reviewText,
      date: new Date(),
    };
    if (newReview.comment !== "") {
      setAddReview([...addReview, newReview]);
      dispatch(exampleActions.allReview(newReview));
      setShowText(false);
    }

    setReviewText("");
    setOpen(false);
  };

  const saveUpdatedReviews = (updatedReviews: Review[]) => {
    setAddReview(updatedReviews);
  };

  const editReview = (comment: string) => {
    const findReviewIndex = reviewData.findIndex(
      (item) => item.comment === comment
    );

    if (findReviewIndex !== -1) {
      setReviewText(reviewData[findReviewIndex].comment);
      setPreComment(reviewData[findReviewIndex].comment);
      setSelectComment(reviewData[findReviewIndex].comment);
      setOpen(true);
    } else {
      console.log("Review not found");
    }
  };

  function updateCommentByImdbId(
    dataArray: Review[],
    imdbId: string | string[],
    newComment: string
  ) {
    const updateData = dataArray.map((item) => {
      if (item.comment === selectComment) {
        return {
          ...item,
          comment: newComment,
          flag: false,
        };
      }
      return item;
    });

    console.log(updateData, "updateDataupdateDataupdateData");
    setReviewText("");
    dispatch(
      exampleActions.allReview({
        update: true,
        newComment,
        imdbId: imdbId as string,
        preComment,
      })
    );
    setOpen(false);
  }

  return (
    <Box>
      <Paper elevation={3} css={styles.navBar}>
        <Typography style={{ color: "#000", fontWeight: 500 }}>
          EcoPortal
        </Typography>
      </Paper>

      <Box sx={{ padding: "20px" }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              sx={{ color: "white" }}
              variant="h6"
              component="h2"
            >
              Edit a review
            </Typography>

            <TextField
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              label="Add review"
              // variant="standard"
              fullWidth
              size="small"
              sx={{ bgcolor: "#1a1a1acf" }}
            />
            <Typography id="modal-modal-description" sx={{ py: 1 }} />
            <Button
              sx={{ color: "orange" }}
              onClick={() =>
                updateCommentByImdbId(reviewData, id as string, reviewText)
              }
            >
              Update
            </Button>
          </Box>
        </Modal>
        <Box sx={{ paddingTop: "40px", position: "fixed" }}>
          <IconButton>
            <ArrowBackIcon onClick={() => router.push("/")} />
          </IconButton>
        </Box>
        <Grid
          sx={{ paddingTop: "100px" }}
          container
          justifyContent="center"
          alignItems="flex-start"
          gap={5}
        >
          <Grid item xs={12} md={4} lg={3}>
            <img
              src={selectMovie?.Poster}
              alt="movie poster"
              style={{ width: "100%", height: "400px" }}
            />
          </Grid>

          <Grid item xs={12} md={4} lg={5}>
            <Box borderBottom={1} borderColor="grey.200">
              <Typography variant="h6" color="textPrimary">
                {selectMovie?.Title}
              </Typography>
            </Box>
            <Box mt={3}>
              <Typography variant="body2" color="textSecondary">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters.
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                {selectMovie?.Year}
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                {selectMovie?.Type}
              </Typography>
            </Box>
            <Box borderTop={1} css={styles.reviews}>
              <Box onClick={handleToggleShipping} sx={{ cursor: "pointer" }}>
                <Typography
                  sx={{ fontSize: 20 }}
                  variant="body1"
                  color="textPrimary"
                >
                  {totalComments > 0 ? `${totalComments} reviews` : "0 reviews"}{" "}
                </Typography>
              </Box>
              <TextField
                size="small"
                sx={{ color: "orange", background: "#2f2d2d" }}
                onClick={() => setShowText(true)}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                label="Add review"
                fullWidth
              />
              <Box>
                {showText && (
                  <Button
                    sx={{ color: "orange" }}
                    color="primary"
                    onClick={() => {
                      setReviewText("");
                      setShowText(!showText);
                    }}
                    disableElevation
                  >
                    Cancel
                  </Button>
                )}
                {showText && (
                  <Button
                    sx={{ color: "orange" }}
                    color="primary"
                    onClick={addReviewFunc}
                    disableElevation
                    disabled={!reviewText}
                  >
                    Comment
                  </Button>
                )}
              </Box>

              {id &&
                reviewData
                  ?.filter(({ imdbId }) => imdbId === id)
                  .map((item, index) => (
                    <Box key={index}>
                      <Reviews editReview={editReview} item={item} />
                    </Box>
                  ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const styles = {
  root: css({
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  }),
  navBar: css({
    width: "100%",
    height: "50px",
    color: "black",
    padding: "16px",
    display: "flex",
    position: "fixed",
    borderRadius: "0px",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#ff9800",
  }),
  reviews: css({
    gap: "10px",
    display: "flex",
    padding: "10px  0px",
    flexDirection: "column",
  }),
};

export default ProductPage;
