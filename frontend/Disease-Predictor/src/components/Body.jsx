import { Container, Fade, Typography } from "@mui/material";
function Body() {
  return (
    <Fade in={true} style={{ transitionDuration: "1000ms" }}>
      <Container
        sx={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            display: { xs: "none", md: "flex" },
            textAlign: "center",

            fontWeight: 700,
            letterSpacing: ".1rem",
            overflowWrap: "anywhere",
            marginBlockStart: "150px",
          }}
        >
          Welcome!
        </Typography>
        <Typography
          variant="h2"
          sx={{
            display: { xs: "flex", md: "none" },
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: ".1rem",
            overflowWrap: "anywhere",
            marginBlockStart: "100px",
          }}
        >
          Welcome!
        </Typography>
      </Container>
    </Fade>
  );
}

export default Body;
