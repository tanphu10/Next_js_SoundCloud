"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import AudioPlayer from "react-h5-audio-player";
import useHasMounted from "@/utils/customHook";
import "react-h5-audio-player/lib/styles.css";
import Container from "@mui/material/Container";
const AppFooter = () => {
  const hasMounted = useHasMounted();
  //   console.log("hasMounted", hasMounted);
  if (!hasMounted) return <></>;
  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        sx={{ top: "auto", bottom: 0, backgroundColor: "#f2f2f2fe" }}
      >
        <Container sx={{ display: "flex", gap: 10 }}>
          <AudioPlayer
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}+/tracks/hoidanit.mp3`}
            volume={0.5}
            // Try other props!
            style={{ boxShadow: "unset", backgroundColor: "#f2f2f2fe" }}
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
            <div style={{ color: "#ccc" }}>Tấn Phú</div>
            <div style={{ color: "black" }}>Who i am</div>
          </div>
        </Container>
      </AppBar>
    </React.Fragment>
  );
};

export default AppFooter;
