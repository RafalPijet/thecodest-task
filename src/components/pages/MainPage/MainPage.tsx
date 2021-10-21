import React from 'react';
import { Grid } from '@material-ui/core';
import { useStyles } from './MainPageStyle';
import image from '../../../images/background.jpg';

const MainPage: React.FC = () => {
  const classes = useStyles();
  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className={classes.container}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={6}>
            Enter Input
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            Result
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default MainPage;
