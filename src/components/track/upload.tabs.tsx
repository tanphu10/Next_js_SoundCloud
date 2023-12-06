"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Step1 from "./steps/step1";
import InforUpload from "./steps/Step2";
import Step2 from "./steps/Step2";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
const UploadTabs = () => {
  const [value, setValue] = React.useState(0);
  //   console.log("value check >>>>",value);
  const [trackPercent, setTrackPercent] = React.useState({
    fileName: "",
    percent: 0,
    uploadedTrackName: "",
  });
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // console.log("newValue", newValue);
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", border: "1px solid #ccc" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tracks" disabled={value !== 0} />
          <Tab label="Basic information" disabled={value !== 1} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Step1
          setTrackPercent={setTrackPercent}
          setValue={setValue}
          trackPercent={trackPercent}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Step2 trackPercent={trackPercent} setValue={setValue} />
      </CustomTabPanel>
    </Box>
  );
};

export default UploadTabs;
