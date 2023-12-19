"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import {
  Box,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import "./style.css";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { data: session } = useSession();
  // console.log("sesion", session);
  const { onClose, selectedValue, open } = props;
  const handleClose = () => {
    onClose(selectedValue);
  };
  const [title, setTitle] = React.useState<string>("");
  const [isPublic, setIsPublic] = React.useState<boolean>(true);
  // console.log(title);
  // console.log(isPublic);
  const router = useRouter();
  const handlePlayList = async () => {
    const res = await sendRequest<IBackendRes<IModelPaginate<any>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/playlists/empty`,
      method: "POST",
      body: {
        title,
        isPublic,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "playlist-by-user",
      },
    });
    router.refresh();
    setTitle("");
  };
  return (
    <Dialog open={open}>
      <div>Add Playlist</div>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TextField
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            label="Tiêu đề"
            variant="standard"
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(event) => setIsPublic(event.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={isPublic === true ? "Public" : "Private"}
            />
          </FormGroup>
        </Box>
      </DialogContent>
      <div style={{ display: "flex", margin: "10px 0", justifyContent: "end" }}>
        <Button onClick={handleClose}>Cancle</Button>
        <Button onClick={handlePlayList}>Save</Button>
      </div>
    </Dialog>
  );
}

export default function ModelPlayList() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add new Playlist
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
