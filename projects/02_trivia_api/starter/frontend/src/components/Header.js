import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Header = ({ onAddClick, onPlayClick }) => {

  const navTo = (uri) => {
    window.location.href = window.location.origin + uri;
  }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" >
              <Button color="inherit" onClick={() => { navTo('/') }}>Udacitrivia</Button>
            </Typography>
            <Typography variant="h6" >
              <Button color="inherit" onClick={onAddClick}>Add</Button>
            </Typography>
            <Typography variant="h6">
              <Button color="inherit" onClick={onPlayClick}>Play</Button>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
}

export default Header;
