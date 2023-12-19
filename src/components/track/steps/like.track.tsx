"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface IProps {
  likes: ITrackLike[];
  track: ITrackTop | null;
}
const LikeTrack = (props: IProps) => {
  //   console.log("props", props);
  const { data: session } = useSession();
  const router = useRouter();
  const { likes, track } = props;
  //   console.log("likes", likes);
  //   console.log(track);
  const handleLikeTrack = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: likes?.some((t) => t._id === track?._id) ? -1 : 1,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-id",
      },
    });
    router.refresh();
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "10px 0",
      }}
    >
      <Stack direction="row" spacing={1}>
        <Chip
          onClick={() => {
            handleLikeTrack();
          }}
          sx={{ borderRadius: "5px" }}
          size="medium"
          icon={<FavoriteIcon />}
          color={likes?.some((t) => t._id === track?._id) ? "error" : "default"}
          label="like"
          //   color="success"
          variant="outlined"
        />
      </Stack>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", marginRight: "10px" }}>
          <div>
            <PlayArrowIcon style={{ fontSize: "20px" }} />
          </div>
          <div>{track?.countPlay}</div>
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <FavoriteIcon style={{ fontSize: "20px" }} />
          </div>
          <div>{track?.countLike}</div>
        </div>
      </div>
    </div>
  );
};
export default LikeTrack;
