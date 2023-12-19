"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Button, Dialog, DialogContent } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { it } from "node:test";
import { useRouter } from "next/navigation";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// function getStyles(name: string, personName: readonly string[], theme: Theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  track: ITrackTop[];
  data: IPlaylist[];
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, track, data } = props;
  console.log("list track", data);
  const handleClose = () => {
    onClose(selectedValue);
  };
  const [playList, setPlayList] = React.useState("");
  const chosenPlaylist = data.find((i) => i._id === playList);
  // console.log("chosenPlaylist", chosenPlaylist);

  // console.log("playList", playList);
  const handlePlayList = (event: SelectChangeEvent) => {
    setPlayList(event.target.value);
  };

  const [personName, setPersonName] = React.useState<string[]>([]);

  console.log("personName", personName);
  // const chosenName = track.find((i) => i._id === personName);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const { data: session } = useSession();
  const router = useRouter();
  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<IModelPaginate<any>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/playlists`,
      method: "PATCH",
      body: {
        id: playList,
        title: chosenPlaylist?.title,
        isPublic: chosenPlaylist?.isPublic,
        tracks: personName,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    console.log("check data patch >>>>>", res);
    router.refresh();
    setPersonName([]);
    setPlayList("");
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Playlist</InputLabel>
            <Select value={playList} label="playlist" onChange={handlePlayList}>
              {data.map((item) => {
                return (
                  <MenuItem key={item._id} value={item._id}>
                    {item.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Track</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {track?.map((names) => {
                return (
                  <MenuItem
                    key={names._id}
                    value={names._id}
                    // style={getStyles(track, personName, theme)}
                  >
                    {names.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <div style={{ display: "flex", margin: "10px 0", justifyContent: "end" }}>
        <Button onClick={handleClose}>Cancle</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </Dialog>
  );
}

interface IProps {
  track: ITrackTop[];
  data: IPlaylist[];
}
export default function SelectPlayList(props: IProps) {
  const { track, data } = props;
  // console.log(track);

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
        data={data}
        track={track}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
