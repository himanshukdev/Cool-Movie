import React from "react";
import {
  Box,
  Card,
  Grid,
  Button,
  CardMedia,
  Typography,
  CardContent,
} from "@mui/material";
import { css } from "@emotion/react";
import { useAppSelector } from "../redux";
import ReviewsIcon from "@mui/icons-material/Reviews";

// Define the types for the props
interface MovieCardProps {
  setReviewText: (text: string) => void;
  idx: string;
  item: {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
  };

  setIdx: (id: string) => void;
  showText: boolean;
  setShowText: (show: boolean) => void;
  addReviewFunc: () => void;
  addReview: { imdbId: string; comment: string }[];
  handleOpen: () => void;
  editReview: (comment: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  item,
  setIdx,
  addReview,
  editReview,
}) => {
  const { reviewData } = useAppSelector((state) => state.example);

  // Check if reviewData exists and filter by imdbID
  const totalComments =
    reviewData?.filter((review) => review?.imdbId === item?.imdbID)?.length ||
    0;

  return (
    <Box
      sx={{
        height: 300,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ maxWidth: "410px" }}>
        <Card
          css={styles.card}
          sx={{
            bgcolor: "#1a1a1acf",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CardMedia
                component="img"
                image={item?.Poster}
                alt={item.Title}
                sx={{
                  boxShadow: 3,
                  borderRadius: 6,
                  height: "270px",
                }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <CardContent sx={{ padding: 0 }}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="start"
                >
                  <Box css={styles.ratingwrapper}>
                    <Typography
                      variant="h3"
                      component="h2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: "18px", md: "20px" },
                        height: "70px",
                        overflow: "hidden",
                        color: "white",
                      }}
                    >
                      {item.Title}
                    </Typography>

                    <Box css={styles.rating}>7.2</Box>
                  </Box>
                </Grid>
                <Typography variant="body2" color="#ccc">
                  {item.Type}
                </Typography>
                <Typography variant="h6" color="#ccc">
                  {item.Year}
                </Typography>
                <Typography
                  borderBottom={1}
                  variant="body1"
                  sx={{ height: "50px", overflow: "hidden", color: "#ccc" }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
                <Button
                  sx={{ color: "#ff9800" }}
                  onClick={() => {
                    setIdx(item.imdbID);
                  }}
                  disableElevation
                >
                  <ReviewsIcon sx={{ paddingRight: "5px" }} />
                  {totalComments ? `${totalComments} reviews` : "No reviews"}
                </Button>

                {item.imdbID &&
                  addReview
                    .filter(({ imdbId }) => imdbId === item.imdbID)
                    .map(({ comment }, index) => (
                      <Typography
                        onClick={() => editReview(comment)}
                        key={index}
                      >
                        {comment}
                      </Typography>
                    ))}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

const styles = {
  rating: css({
    width: "35px",
    height: "30px",
    padding: "5px",
    fontWeight: 600,
    borderRadius: "8px",
    background: "#ff9800",
  }),
  ratingwrapper: css({
    gap: "4px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  }),
  card: css({
    display: "flex",
    height: "250px",
    padding: "20px",
    cursor: "pointer",
    borderRadius: "25px",
    overflow: "visible",
    boxShadow:
      "0px 1px 10px 1.5px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,-367.88)",
  }),
};

export default MovieCard;
