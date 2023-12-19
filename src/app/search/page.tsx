import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SearchTrack from "@/components/search/search.track";
export default async function search() {
  return (
    <Container>
      <SearchTrack />
    </Container>
  );
}
