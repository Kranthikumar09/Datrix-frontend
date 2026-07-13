import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppTextField from '../../components/ui/AppTextField';

/**
 * Step 3 — optional query/notes before final submission.
 */
const QueryStep = ({ query, onChange, onPrevious, onSubmit, submitting }) => (
  <Stack spacing={3}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Got a question, feedback, or thoughts?
      </Typography>
      <Typography color="text.secondary">
        Type your query here (max 500 characters).
      </Typography>
    </Box>

    <AppTextField
      fullWidth
      label="Query"
      name="query"
      value={query}
      onChange={onChange}
      placeholder="Type your query (max 500 chars)"
      multiline
      rows={4}
      inputProps={{ maxLength: 500 }}
      helperText={`${query.length}/500 characters`}
    />

    {submitting && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Submitting application...
        </Typography>
      </Box>
    )}

    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Button variant="outlined" onClick={onPrevious} disabled={submitting} size="large">
        Previous
      </Button>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={submitting}
        size="large"
        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  </Stack>
);

export default QueryStep;
