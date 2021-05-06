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
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
}));

function NavListItem({ title, url }) {
  return (
    <ListItem button key={url}>
      <Link to={url}>
        <ListItemText primary={title}/>
      </Link>
    </ListItem>
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
      {nav.map(({ title, url, children }) => {
        if (typeof url === 'string') {
          return <NavListItem title={title} url={url} key={title}/>;          
        } else if (children.length > 0) {
          return (
            <NestedNavListItem title={title} key={title}>
              <NestedNav nav={children} top={false} className={classes.nested}/>
            </NestedNavListItem>
          );
        }
        return null;
      })}
    </List>
  );
}
