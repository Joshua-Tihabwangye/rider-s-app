import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Stack } from "@mui/material";
import ScreenScaffold from "../components/ScreenScaffold";
import PageHeader from "../components/PageHeader";
import AppCard from "../components/primitives/AppCard";
import { uiTokens } from "../design/tokens";

export default function LanguageSettings(): React.JSX.Element {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("en");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <ScreenScaffold
      header={
        <PageHeader
          title="Language"
          subtitle="App Preferences"
          onBack={() => navigate(-1)}
        />
      }
      contentSx={{ pt: { xs: 2.5, md: 3 } }}
    >
      <AppCard>
        <Typography variant="subtitle2" sx={{ ...uiTokens.text.itemTitle, mb: 2 }}>
          Select Language
        </Typography>
        <RadioGroup value={value} onChange={handleChange}>
          <Stack spacing={1}>
            <FormControlLabel 
              value="en" 
              control={<Radio color="primary" />} 
              label={<Typography variant="body2">English (US)</Typography>} 
            />
            <FormControlLabel 
              value="sw" 
              control={<Radio color="primary" />} 
              label={<Typography variant="body2">Swahili</Typography>} 
            />
            <FormControlLabel 
              value="fr" 
              control={<Radio color="primary" />} 
              label={<Typography variant="body2">French</Typography>} 
            />
            <FormControlLabel 
              value="es" 
              control={<Radio color="primary" />} 
              label={<Typography variant="body2">Spanish</Typography>} 
            />
          </Stack>
        </RadioGroup>
      </AppCard>
      
      <Box sx={{ mt: 3, px: 1 }}>
        <Typography variant="caption" sx={{ color: (t) => t.palette.text.secondary }}>
          The app will automatically restart to apply language changes if necessary.
        </Typography>
      </Box>
    </ScreenScaffold>
  );
}
