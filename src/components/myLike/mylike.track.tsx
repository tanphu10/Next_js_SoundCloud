"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Container } from "@mui/material";
import { useTrackContext } from "@/lib/track.wrapper";

// interface IProps {
//   content: ITrackLike;
// }
const MyLike = (props: any) => {
  const { content } = props;
  const theme = useTheme();
//   console.log(content);
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
//   console.log(currentTrack);
  return (
    <Container style={{ margin: "20px 10px" }}>
      <Card sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {content.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {content.description}
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <IconButton aria-label="previous">
              {theme.direction === "rtl" ? (
                <SkipNextIcon />
              ) : (
                <SkipPreviousIcon />
              )}
            </IconButton>
            {(content._id !== currentTrack._id ||
              (content._id === currentTrack._id &&
                currentTrack.isPlaying == false)) && (
              <IconButton
                aria-label="play"
                onClick={() => {
                  setCurrentTrack({ ...content, isPlaying: true });
                }}
              >
                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            )}

            {content._id === currentTrack._id &&
              currentTrack.isPlaying == true && (
                <IconButton
                  aria-label="pause"
                  onClick={() => {
                    setCurrentTrack({ ...content, isPlaying: false });
                  }}
                >
                  <PauseIcon sx={{ height: 38, width: 38 }} />{" "}
                </IconButton>
              )}
            <IconButton aria-label="next">
              {theme.direction === "rtl" ? (
                <SkipPreviousIcon />
              ) : (
                <SkipNextIcon />
              )}
            </IconButton>
          </Box>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${content.imgUrl}`}
          alt="Live from space album cover"
        />
      </Card>
    </Container>
  );
};

export default MyLike;
