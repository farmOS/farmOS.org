import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 700,
  },
  headings: {
    '& > ul': {
      padding: 0,
      margin: 0,
    },
    '& ul ul': {
      paddingLeft: theme.spacing(2),
    },
    '& li': {
      listStyle: 'none',
      margin: `${theme.spacing(1)}px 0 0 0`,
    },
    '& p': {
      margin: 0,
    },
    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  },
  active: {
    color: `${theme.palette.primary.light} !important`,
    fontWeight: 700,
  },  
}));

function findTopVisible(headingMap) {
  const visible = [];
  headingMap.forEach(({ h, a }, id) => {
    const { top, left, bottom, right } = h.getBoundingClientRect();
    const isVisible = (
      top >= 0 &&
      left >= 0 &&
      bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    if (isVisible) {
      visible.push({ top, id, h, a });
    }
  });
  visible.sort((a, b) => a.top - b.top);
  return visible[0];
}

export default function TableOfContents(props) {
  const { __html, headings, title = 'Table of contents' } = props;
  const tocRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    const headingsMap = headings.reduce((map, id) => {
      map.set(id, {
        h: document.getElementById(id),
        a: tocRef.current.querySelector(`a[href="#${id}"]`),
      });
      return map;
    }, new Map());
    let currentActiveHeading = headingsMap.get(headings[0]);
    const setCurrentActiveHeading = () => {
      const topVisible = findTopVisible(headingsMap);
      if (!topVisible || topVisible.id === currentActiveHeading.id) {
        return;
      }
      currentActiveHeading.a.classList.remove(classes.active);
      currentActiveHeading = topVisible;
      currentActiveHeading.a.classList.add(classes.active);
    };
    setCurrentActiveHeading();
    const observer = new IntersectionObserver(setCurrentActiveHeading);
    headingsMap.forEach(({ h }) => { observer.observe(h); });
    return () => {
      headingsMap.forEach(({ h }) => { observer.unobserve(h); });
    }
  }, [headings, tocRef, classes]);

  return (<>
    <Typography component='label' className={classes.title}>{title}</Typography>
    <Box ref={tocRef} className={classes.headings} dangerouslySetInnerHTML={{ __html }}/>
  </>);
}
