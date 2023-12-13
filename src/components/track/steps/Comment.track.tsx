"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import WaveSurfer from "wavesurfer.js";
import { useRouter } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";
import { useHasMounted } from "@/utils/customHook";
dayjs.extend(relativeTime);
interface IProps {
  track: ITrackTop | null;
  comments: ITrackComment[];
  wavesurfer: WaveSurfer | null;
}
const CommentTrack = (props: IProps) => {
  //   console.log(url);
  const { comments, track, wavesurfer } = props;
  const router = useRouter();
  const hasMounted = useHasMounted();
  //   console.log("track", track?.uploader.type);
  const { data: session } = useSession();
  const [yourComment, setYourComment] = React.useState("");
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };
  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<ITrackComment>>({
      url: `http://localhost:8000/api/v1/comments`,
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      setYourComment("");
      router.refresh();
    }
  };

  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      //   console.log("duration", duration);
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };
  return (
    <>
      <div>
        {session?.user && (
          <div
            // component="form"
            // sx={{
            //   "& > :not(style)": { width: "100%", maxWidth: "100%" },
            // }}
            // noValidate
            //   autoComplete="off"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <TextField
              style={{ width: "90%" }}
              value={yourComment}
              onChange={(e) => {
                setYourComment(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              label="comment"
              variant="standard"
            />
            <button
              style={{ width: "10%" }}
              onClick={() => {
                handleSubmit();
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: "20px" }}>
        <div style={{ marginLeft: "10px", width: "25%" }}>
          <img
            style={{ width: "150px", height: "150px" }}
            src={fetchDefaultImages(track?.uploader?.type!)}
            alt=""
          />
          {track?.uploader?.email && (
            <p style={{ marginLeft: "10px" }}>{track?.uploader?.email}</p>
          )}
        </div>
        <div style={{ width: "75%" }}>
          {comments?.map((comment) => {
            return (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "25px",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{
                      height: 40,
                      width: 40,
                    }}
                    src={fetchDefaultImages(comment.user.type)}
                  />
                  <div>
                    <div style={{ fontSize: "13px" }}>
                      {comment?.user?.name ?? comment?.user?.email} at
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleJumpTrack(comment.moment)}
                      >
                        &nbsp; {formatTime(comment.moment)}
                      </span>
                    </div>
                    <div>{comment.content}</div>
                  </div>
                </Box>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {hasMounted && dayjs(comment.createdAt).fromNow()}
                </div>
              </Box>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default CommentTrack;
