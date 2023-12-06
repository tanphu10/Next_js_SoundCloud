import React, { useEffect } from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSession } from "next-auth/react";
import axios from "axios";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const InputFileUpload = (props: any) => {
  const { setInfo, info } = props;
  const { data: session } = useSession();

  const handleUploadImg = async (image: any) => {
    const formData = new FormData();
    formData.append("fileUpload", image);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      setInfo({ ...info, imgUrl: res.data.data.fileName });
      console.log("check res >>>", res);
    } catch (error) {
      // @ts-ignore
      console.log("check data  error>>>>", error?.response?.data.message);
    }
  };
  return (
    <Button
      component="label"
      variant="contained"
      onChange={(e) => {
        // console.log(e.target.files);
        const event = e.target as HTMLInputElement;
        if (event.files) {
          // console.log("check =>>> event", event.files[0]);
          handleUploadImg(event.files[0]);
        }
      }}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
};
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
interface Iprops {
  trackPercent: {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
  };
  setValue: (v: number) => void;
}
interface INewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imgUrl: string;
  category: string;
}
const Step2 = (props: Iprops) => {
  const toast = useToast();

  const { data: session } = useSession();
  // console.log("check đây thử track =>>>", props.trackPercent);
  const { trackPercent, setValue } = props;
  const [info, setInfo] = React.useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });
  // console.log("check info >>>", info);
  React.useEffect(() => {
    if (trackPercent && trackPercent.uploadedTrackName)
      setInfo({ ...info, trackUrl: trackPercent.uploadedTrackName });
  }, [trackPercent]);
  const category = [
    { value: "CHILL", lable: "CHILL" },
    { value: "WORKOUT", lable: "WORKOUT" },
    { value: "PARTY", lable: "PARTY" },
  ];
  const handleSubmitForm = async () => {
    console.log("check info =>>>>", info);
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: "http://localhost:8000/api/v1/tracks",
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: {
        title: info.title,
        description: info.description,
        trackUrl: info.trackUrl,
        imgUrl: info.imgUrl,
        category: info.category,
      },
    });
    console.log("check res save", res);
    if (res.data) {
      // alert("create success");
      toast.success("create success");
      setValue(0);
    } else {
      // alert(res.message);
      toast.error(res.message);
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <p>{trackPercent.fileName}</p>
      <LinearProgressWithLabel value={trackPercent.percent} />
      <Grid container spacing={1}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            // justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ height: 250, width: 250, background: "#ccc" }}>
            <div>
              {info.imgUrl && (
                <img
                  height={250}
                  width={250}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                />
              )}
            </div>
          </div>
          <InputFileUpload setInfo={setInfo} info={info} />
        </Grid>
        <Grid item xs={6} md={8}>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "100vh" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              value={info?.title}
              onChange={(e) => setInfo({ ...info, title: e.target.value })}
              label="Title"
              variant="standard"
            />
            <TextField
              value={info?.description}
              onChange={(e) =>
                setInfo({ ...info, description: e.target.value })
              }
              label="Description"
              variant="standard"
            />
            <TextField
              value={info?.category}
              onChange={(e) => setInfo({ ...info, category: e.target.value })}
              select
              label="Category"
              fullWidth
              variant="standard"
            >
              {category.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.lable}
                </MenuItem>
              ))}
            </TextField>
            <Button
              onClick={() => {
                handleSubmitForm();
              }}
              color="error"
              sx={{ border: "1px solid red" }}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step2;
