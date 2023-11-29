"use client";
import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import { Container } from "@mui/material";

const DetailTrackPage = () => {
  // const searchParams = useSearchParams();
  // const search = searchParams.get("audio");
  // console.log("check search>>> ", search);
  // console.log(">>> check console.log props", props);
  return (
    <Container>
      Detail TrackPage
      <div>
        <WaveTrack />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
