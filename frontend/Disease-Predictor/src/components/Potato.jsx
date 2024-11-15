import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  CircularProgress,
  Button,
  Grid2,
  CardMedia,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import Clear from "@mui/icons-material/Clear";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  media: { height: 400 },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    // height: "93vh",
    marginTop: "5px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: "transparent",
    boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%) !important",
    borderRadius: "15px",
  },
  input: { display: "none" },
  loader: { color: "#be6a77 !important" },
}));

export const Potato = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [image, setImage] = useState(false);
  let confidence = 0;

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    setImage(true);
    setData(null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  const sendFile = async () => {
    if (image && selectedFile) {
      let formData = new FormData();
      formData.append("file", selectedFile);

      try {
        let res = await axios.post(
          "http://localhost:8000/predict/1",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsloading(false);
      }
    }
  };

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setIsloading(true);
    sendFile();
  }, [selectedFile]);

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  if (data) confidence = (parseFloat(data.confidence) * 100).toFixed(2);

  return (
    <React.Fragment>
      <Container
        maxWidth={false}
        className={classes.mainContainer}
        disableGutters={true}
      >
        <Grid2
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className={classes.gridContainer}
        >
          <Grid2 item xs={12}>
            <Card className={classes.imageCard}>
              {image && preview ? (
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="img"
                />
              ) : (
                <CardContent>
                  <div
                    {...getRootProps()}
                    className="dropzone"
                    style={{
                      border: "2px dashed #ddd",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <input {...getInputProps()} />
                    <Typography variant="body1">
                      Drag and drop an image of a potato plant leaf, or click to
                      select one
                    </Typography>
                  </div>
                </CardContent>
              )}

              {data && (
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.class}</TableCell>
                          <TableCell align="right">{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent>
                  <CircularProgress
                    color="secondary"
                    className={classes.loader}
                  />
                  <Typography variant="h6">Processing</Typography>
                </CardContent>
              )}
            </Card>
          </Grid2>

          {data && (
            <Grid2 item className={classes.buttonGrid}>
              <Button
                variant="contained"
                className={classes.clearButton}
                onClick={clearData}
                startIcon={<Clear />}
              >
                Clear
              </Button>
            </Grid2>
          )}
        </Grid2>
      </Container>
    </React.Fragment>
  );
};
