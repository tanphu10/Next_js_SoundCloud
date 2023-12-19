"use client";
import React, { useCallback } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./theme.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { sendRequestFile } from "@/utils/api";
import { useSession } from "next-auth/react";
import axios from "axios";
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
const InputFileUpload = () => {
  return (
    <Button
      component="label"
      variant="contained"
      onClick={(event) => {
        event.preventDefault();
      }}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
};
interface IProps {
  setTrackPercent: any;
  setValue: (v: number) => void;
  trackPercent: any;
}
const Step1 = (props: IProps) => {
  const { trackPercent } = props;
  const { data: session } = useSession();
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      if (acceptedFiles && acceptedFiles[0]) {
        const audio = acceptedFiles[0];
        const formData = new FormData();
        formData.append("fileUpload", audio);
        props.setValue(1);
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/files/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
                delay: 5000,
              },
              onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.floor(
                  (progressEvent.loaded * 100) / progressEvent.total!
                );
                // console.log("check percentCompleted >>>", percentCompleted);
                console.log("check acceptedFiles >>>", acceptedFiles[0]);
                props.setTrackPercent({
                  ...trackPercent,
                  fileName: acceptedFiles[0].name,
                  percent: percentCompleted,
                });
                // do whatever you like with the percentage complete
                // maybe dispatch an action that will update a progress bar or something
              },
            }
          );
          console.log("check trackPercent >>>", trackPercent);
          props.setTrackPercent((prevState :any)=>({
            ...prevState,
            uploadedTrackName: res.data.data.fileName,
          }));
        } catch (error) {
          // @ts-ignore
          console.log("check data  error>>>>", error?.response?.data.message);
        }
      }
    },
    [session]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      audio: [".mp3", "m4a"],
    },
  });
  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>{file.path}</li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <InputFileUpload />
        <p>Click or drag to upload file track</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};

export default Step1;
