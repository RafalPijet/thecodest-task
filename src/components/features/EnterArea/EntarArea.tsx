import React, { useState, useEffect } from 'react';
import { Paper, TextField } from '@material-ui/core';
import { Props, useStyles } from './EnterAreaStyle';

const EnterArea: React.FC<Props> = (props) => {
  const { getContentText, setCorrectlyText } = props;
  const classes = useStyles();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (setCorrectlyText !== null) {
      setValue(setCorrectlyText);
    }
  }, [setCorrectlyText]);

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    getContentText(event.target.value);
  };

  return (
    <Paper className={classes.root} elevation={5}>
      <TextField
        className={classes.textField}
        id="enter-textarea"
        label="Enter text"
        variant="outlined"
        multiline
        fullWidth
        rows={30}
        value={value}
        onChange={handleChangeText}
      />
    </Paper>
  );
};

export default EnterArea;
