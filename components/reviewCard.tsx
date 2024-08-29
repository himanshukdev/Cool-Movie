import { FC, useState } from "react";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

// Define types for props
interface ReviewCardProps {
  item: {
    imdbId: string;
    comment: string;
    date: string;
  };
  editReview: (comment: string) => void;
}

const ReviewCard: FC<ReviewCardProps> = ({ item, editReview }) => {
  // Parse date
  const date = new Date(item.date);

  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options);

  // Initialize state with type
  const [selectId, setSelectId] = useState<string | undefined>(undefined);

  console.log(selectId, "selectId");

  return (
    <Box sx={{ maxWidth: "550px" }}>
      <Box onClick={() => setSelectId(item.imdbId)}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {item.comment}
          </Typography>
          <ModeEditOutlineIcon onClick={() => editReview(item.comment)} />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" fontWeight="bold">
            Anonymous
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default ReviewCard;
