import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Ontology() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container
      id="ontology"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        fontFamily="monospace"
        fontWeight="bold"
        color="text.primary"
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        Ontology
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="h3" variant="subtitle2"  fontFamily="monospace"
              fontWeight="bold">
              What is an ontology?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              fontFamily="monospace"
              fontWeight="bold"
              sx={{ maxWidth: { sm: '200%', md: '70%' } }}
            >
              An ontology is a set of concepts and sections in within a specific topic that specifies
              their attributes and relationships.

            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="h3" variant="subtitle2"  fontFamily="monospace"
              fontWeight="bold">
              How does this ontology apply to MovieGraf?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              fontFamily="monospace"
              fontWeight="bold"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              We use this ontology as the basis for building our graph database, which is unique to
              our concept. The ontology served as a skeleton or model to follow while creating this tool 
              so that it can accurately represent the complex relationships between each component of 
              media production.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="h5" variant="subtitle2"fontFamily="monospace" fontWeight="bold">
              What is the Ontology of Media Creation?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              fontFamily="monospace"
              fontWeight="bold"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              The Ontology of Media Creation is the ontology we used as the basis of this project. More details about this ontology
              can be found at this link: 
              https://movielabs.com/production-technology/ontology-for-media-creation/ 

            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="h3" variant="subtitle2" fontFamily="monospace"
              fontWeight="bold">
              Is this project open-source?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              fontFamily="monospace"
              fontWeight="bold"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Yes, this project is open source and can be used and modified by anyone!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}