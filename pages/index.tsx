import { css } from "@emotion/react";
import { Box, Paper, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import { fetchMovies } from "../redux/slices/example/slice";
import MovieCard from "../components/movieCards";
import { SxProps, Theme } from "@mui/system";
import { useRouter } from "next/router";

interface Review {
  imdbId: string | undefined;
  comment: string;
}

interface MovieData {
  Search: {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
  }[];
  totalResults: string;
  Response: string;
}
type MovieItem = {
  imdbID: string;
  // add other fields as required
};

type FetchData = {
  Search: MovieItem[];
  // add other fields as required
};
interface Review {
  comment: string;
  // add other properties if needed
}

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


const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { fetchData } = useAppSelector((state) => state?.example);

  console.log(fetchData?.Search, "fetchData");

  const [addReview, setAddReview] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [showText, setShowText] = useState(false);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState<string | undefined>();
  const [mode, setMode] = useState("dark");

  console.log(addReview, "addReview");

  useEffect(() => {
    dispatch(fetchMovies());
  }, []);

  const handleOpen = () => setOpen(true);

  const addReviewFunc = () => {
    setReviewText("");

    const newReview = {
      imdbId: idx,
      comment: reviewText,

      date: new Date(),
    };
    if (newReview?.comment !== "") {
      setAddReview([...addReview, newReview]);
    }

    setReviewText("");
    setOpen(false);
  };

  const editReview = (comment: string) => {
    const findReview: Review | undefined = addReview?.find(
      (item: Review) => item.comment === comment
    );
    setReviewText(findReview?.comment || "");
    setOpen(true);
  };

  const navigateToDetails = (id: any) => {
    router.push(`/details/${id}`);
  };
  return (
    <Box sx={{ bgcolor: "#0000" }} css={styles.root}>
      <Paper
        style={{ position: "fixed", width: "100%" }}
        elevation={3}
        css={styles.navBar}
      >
        <Typography style={{color:"black", fontWeight: 500}}>{"EcoPortal"}</Typography>
      </Paper>
      <Box
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
        css={styles.grid}
      >
        {fetchData?.Search?.map(
          (item: {
            imdbID: any;
            Poster?: string;
            Title?: string;
            Type?: string;
            Year?: string;
          }) => (
            <Box
              key={item.imdbID}
              onClick={() => navigateToDetails(item.imdbID)}
            >
              <MovieCard
                addReview={addReview}
                idx={idx}
                setIdx={setIdx}
                showText={showText}
                item={item}
                setReviewText={setReviewText}
                addReviewFunc={addReviewFunc}
                handleOpen={handleOpen}
                editReview={editReview}
              />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

const styles = {
  grid: css({
    gap: "30px",
    padding: "20px",
    display: "grid",
    marginTop: "80px",
    justifyContent: "center",
  }),
  root: css({
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  }),
  navBar: css({
    height: 50,
    padding: 16,
    borderRadius: 0,
    display: "flex",
    background: "#ff9800",
    alignItems: "center",
    alignSelf: "stretch",
  }),
};

export default Home;
