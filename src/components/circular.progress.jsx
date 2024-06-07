import { CircularProgress, Stack } from "@mui/material";
import * as React from "react";
 
export default function CircularColor() {
  return (
    <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
      <CircularProgress color="success" />
    </Stack>
  );
}
