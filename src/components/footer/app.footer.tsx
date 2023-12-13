"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import AudioPlayer from "react-h5-audio-player";
import { useHasMounted } from "@/utils/customHook";
import "react-h5-audio-player/lib/styles.css";
import Container from "@mui/material/Container";
import { TrackContext, useTrackContext } from "@/lib/track.wrapper";
const AppFooter = () => {
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  // console.log("check =>>> currentTrack ", currentTrack);
  const hasMounted = useHasMounted();
  //   console.log("hasMounted", hasMounted);
  const playerRef = React.useRef(null);
  // console.log("playref", playerRef?.current);
  if (!hasMounted) return <></>;

  // @ts-ignore
  if (currentTrack?.isPlaying) {
    // @ts-ignore
    playerRef?.current?.audio.current.play();
  } else {
    // @ts-ignore
    playerRef?.current?.audio.current.pause();
  }
  return (
    <>
    {
      currentTrack._id &&
      <div style={{ marginTop: 60 }}>
      <AppBar
        position="fixed"
        sx={{ top: "auto", bottom: 0, backgroundColor: "#f2f2f2fe" }}
      >
        <Container
          sx={{ display: "flex", gap: 10, ".rhap_main": { gap: "30px" } }}
        >
          <AudioPlayer
            ref={playerRef}
            layout="horizontal"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}tracks/${currentTrack?.trackUrl}`}
            volume={0.5}
            // Try other props!
            style={{ boxShadow: "unset", backgroundColor: "#f2f2f2fe" }}
            onPlay={() => {
              // console.log("check on play");
              setCurrentTrack({ ...currentTrack, isPlaying: true });
            }}
            onPause={() => {
              setCurrentTrack({ ...currentTrack, isPlaying: false });
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              minWidth: 100,
            }}
          >
            <div style={{ color: "#ccc" }}>{currentTrack.description}</div>
            <div style={{ color: "black" }}>{currentTrack.title}</div>
          </div>
        </Container>
      </AppBar>
    </div>
    }
    </>
  );
};

export default AppFooter;
