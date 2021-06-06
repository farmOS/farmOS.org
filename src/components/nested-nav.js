import React from 'react';
import { Link } from "gatsby-theme-material-ui";
import { makeStyles } from '@material-ui/core/styles';
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
      <ListItem button>
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

export default function NestedNav({ nav, root = true, ...rest }) {
  const classes = useStyles();
  const { key, title, page, children } = nav;
  let items = null;

  if (root) {
    items = (
      <List component='nav' className={classes.root} {...rest}>
        {children.map(child => (
          <NestedNav nav={child} root={false} key={child.key}/>
        ))}
      </List>
    );
  } else if (children.length === 0 && page) {
    items = <NavListItem title={page.title} pathname={page.pathname} key={key}/>;
  } else if (children.length > 0) {
    const nested = (page ? [{ ...nav, children: [] }, ...children] : children)
      .map(child => (
        <NestedNav nav={child} root={false} key={child.key} className={classes.nested}/>
      ));
    items = (
      <NestedNavListItem title={title} key={key}>
        {nested}
      </NestedNavListItem>
    );
  }
  return (
    <List component='nav' className={classes.root} { ...rest }>
      {items}
    </List>
  );
}
