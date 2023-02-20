import * as React from "react"
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from 'gatsby-material-ui-components';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import theme from '../../../theme';

const useStyles = makeStyles({
  main: {
    '& h1': {
      color: theme.palette.text.secondary,
      fontWeight: 300,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-.01em',
      margin: '0 0 1.25rem',
    },
    '& h2': {
      margin: '1.6rem 0 0.64rem',
      fontSize: '1.5625rem',
      fontWeight: 300,
      lineHeight: 1.4,
      letterSpacing: '-.01em',
    }
  },
});

const ProjectsPage = () => {
  const classes = useStyles();
  const [contribModules, setContribModules] = useState([]);
  const [customModules, setCustomModules] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`https://raw.githubusercontent.com/wotnak/farmos-community-projects/main/projects.json`)
      const data = await response.json();
      setContribModules(data.filter(value => value.type === 'contrib-module'))
      setCustomModules(data.filter(value => value.type === 'custom-module'))
      setOtherProjects(data.filter(value => value.type === 'project'))
    }
    fetchData();
  }, []);
  return (
    <>
      <Helmet title="Community Projects"></Helmet>
      <Box component='main' className={classes.main}>
        <Typography variant='h1'>Community Projects</Typography>
        {contribModules.length > 0 &&
          <>
            <Typography variant='h2'>Contrib modules</Typography>
            <ul>
              {contribModules.map(module => {
                return (<li><Link to={module['drupal.org'] || module.src}>{module.name}</Link> - {module.desc}</li>)
              })}
            </ul>
          </>
        }
        {customModules.length > 0 &&
          <>
            <Typography variant='h2'>Custom modules</Typography>
            <ul>
              {customModules.map(module => {
                return (<li><Link to={module['drupal.org'] || module.src}>{module.name}</Link> - {module.desc}</li>)
              })}
            </ul>
          </>
        }
        {otherProjects.length > 0 &&
          <>
            <Typography variant='h2'>Other projects</Typography>
            <ul>
              {otherProjects.map(project => {
                return (<li><Link to={project['drupal.org'] || project.src}>{project.name}</Link> - {project.desc}</li>)
              })}
            </ul>
          </>
        }
      </Box>
    </>
  );
};

export default ProjectsPage;
