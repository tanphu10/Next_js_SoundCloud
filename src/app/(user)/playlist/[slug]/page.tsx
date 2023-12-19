import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ModelPlayList from "@/components/playlist/createPlaylist/model.PlayList";
import SelectPlayList from "@/components/playlist/createPlaylist/select.Playlist";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { sendRequest } from "@/utils/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { getServerSession } from "next-auth";
import CurrentTrack from "@/components/playlist/list.track";
import { Fragment } from "react";

const PlayListPage = async () => {
  const session = await getServerSession(authOptions);
  // console.log(session);
  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/playlists?current=1&pageSize=10`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
  // console.log("check data playlist= >>>>", res.data?.result);

  // ---lấy danh sách bài track
  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
  // console.log(res1);

  const res2 = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/playlists/by-user`,
    method: "POST",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["playlist-by-user"] },
    },
  });
  // console.log(res2.data?.result);
  const data = res2.data?.result ?? [];
  return (
    <Container>
      <div style={{ margin: "20px 0", display: "flex", justifyContent: "end" }}>
        <ModelPlayList />
        <SelectPlayList
          track={res1?.data?.result ?? []}
          data={res2.data?.result ?? []}
        />
      </div>
      <Box sx={{ mt: 3 }}>
        {data?.map((item) => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {item.tracks?.map((track, index: number) => {
                  console.log("track", track);
                  return (
                    <Fragment key={track._id}>
                      {index === 0 && <Divider />}
                      <CurrentTrack track={track} />
                      <Divider />
                    </Fragment>
                  );
                })}
                {/* {item.tracks?.length === 0 && <span>No data.</span>} */}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
  );
};

export default PlayListPage;
