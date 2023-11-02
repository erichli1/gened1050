"use client";

import { styled } from "@mui/material/styles";
import {
  Alert,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { processCsvIntoString } from "./processors";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DownloadIcon from "@mui/icons-material/Download";
import LoopIcon from "@mui/icons-material/Loop";
import { TEST_MAPPING_DATA } from "./utils";

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

export default function Home() {
  const [file, setFile] = useState<File | null>();
  const [numGroups, setNumGroups] = useState<number | null>(5);
  const [regenerateTime, setRegenerateTime] = useState<number>(Date.now());
  const [groups, setGroups] = useState<Array<Array<string>>>();
  const [fileError, setFileError] = useState<boolean>(false);

  useEffect(() => {
    if (file) {
      setFileError(false);
      setGroups(undefined);

      if (!numGroups || numGroups <= 2) {
        return;
      }

      processCsvIntoString(file, numGroups!, setGroups, setFileError);
    }
  }, [file, numGroups, regenerateTime]);

  const createAndDownloadCSV = () => {
    const csvData = [["Name", "Character"], ...TEST_MAPPING_DATA];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <Container maxWidth="sm">
        <Typography variant="h3">gened1050 groups</Typography>
        <Typography variant="body1">
          Upload a CSV of students and their characters to generate groups where
          no student will be in a group with their character or the person
          playing them.
        </Typography>
        <Button
          variant="text"
          onClick={createAndDownloadCSV}
          startIcon={<DownloadIcon />}
        >
          Download template.csv here
        </Button>
        <br />
        <br />
        <Grid container>
          <TextField
            label="# of groups"
            type="number"
            size="small"
            variant="outlined"
            value={numGroups}
            onChange={(e) => setNumGroups(parseInt(e.target.value))}
          />
          &nbsp;
          <Button
            component="label"
            variant="contained"
            color={file ? (fileError ? "error" : "success") : "primary"}
            startIcon={
              file ? (
                fileError ? (
                  <WarningAmberIcon />
                ) : (
                  <CheckCircleIcon />
                )
              ) : (
                <CloudUploadIcon />
              )
            }
            disabled={!numGroups || numGroups < 3}
          >
            {file ? file.name : "Upload file"}
            <VisuallyHiddenInput
              type="file"
              accept=".csv"
              onChange={(e) => {
                setFile(null);
                if (e.target.files) setFile(e.target.files[0]);
              }}
            />
          </Button>
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoopIcon />}
            onClick={() => {
              setRegenerateTime(Date.now());
            }}
            disabled={!file || !numGroups || numGroups < 3}
          >
            Regenerate
          </Button>
        </Grid>
        <br />
        {(!numGroups || numGroups < 3) && (
          <>
            <Alert severity="warning">
              Please make sure the number of groups is at least 3.
            </Alert>
            <br />
          </>
        )}
        {fileError && (
          <>
            <Alert severity="error">
              Invalid file. Please make sure you upload a CSV with only two
              columns and where the first row includes a cell called Name.
            </Alert>
            <br />
          </>
        )}
        {groups &&
          groups.map((group, index) => (
            <Typography variant="body1" key={index}>
              <Typography component="span" fontWeight="bold">
                Group {index + 1}:{" "}
              </Typography>
              {group.map((student) => student).join(", ")}
            </Typography>
          ))}
        {groups && groups.length === 0 && (
          <Alert severity="error">No groups possible.</Alert>
        )}
      </Container>
    </main>
  );
}
