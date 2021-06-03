import React from 'react';
import { Link } from "gatsby-theme-material-ui";
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& a:hover': {
      textDecoration: 'none',
    }
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
}));

function NavListItem({ title, pathname }) {
  return (
    <Link to={pathname}>
      <ListItem button key={pathname}>
        <ListItemText primary={title}/>
      </ListItem>
    </Link>
  );          
}

function NestedNavListItem({ title, children }) {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={title}/>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </React.Fragment>
  );
}

export default function NestedNav({ nav, header, top = true, ...rest }) {
  const classes = useStyles();
  let aria = null; let subheader = null;

  if (header && top) {
    aria = "nested-list-subheader";
    subheader = (
      <ListSubheader
        component="div"
        id="nested-list-subheader"
        disableSticky={true}
      >
        {header}
      </ListSubheader>
    );
  }

  return (
    <List
      component="nav"
      aria-labelledby={aria}
      subheader={subheader}
      className={classes.root}
      { ...rest }
    >
      {nav.map(({ title, pathname, children, page }) => {
        if (page && children.length === 0) {
          return <NavListItem title={title} pathname={pathname} key={pathname}/>;
        }
        if (page && children.length > 0) {
          const nested = [
            { title, pathname, children: [], page },
            ...children,
          ];
          const directoryTitle = pathname
            .split('/')
            .filter(str => !!str)
            .pop()
            .split('-')
            .map(str => str.charAt(0).toUpperCase() + str.slice(1))
            .join(' ');
          return (
            <NestedNavListItem title={directoryTitle} key={pathname}>
              <NestedNav nav={nested} top={false} className={classes.nested}/>
            </NestedNavListItem>
          );
        }
        if (!page && children.length > 0) {
          return (
            <NestedNavListItem title={title} key={pathname}>
              <NestedNav nav={children} top={false} className={classes.nested}/>
            </NestedNavListItem>
          );
        }
        return null;
      })}
    </List>
  );
}
