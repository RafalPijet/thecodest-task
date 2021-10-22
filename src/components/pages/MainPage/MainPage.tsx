import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Grid } from '@material-ui/core';
import EnterArea from '../../features/EnterArea/EntarArea';
import DisplayArea from '../../features/DisplayArea/DisplayArea';
import { useStyles } from './MainPageStyle';
import { Markers, AxiosResponseOfName } from '../../../types';
import image from '../../../images/background.jpg';

const MainPage: React.FC = () => {
  const classes = useStyles();
  const [enteredText, setEnteredText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [findedMarkersQuantity, setFindedMarkersQuantity] = useState<number>(0);
  const [markersWithoutDuplicates, setMarkersWithoutDuplicates] = useState(
    new Map<string, Markers>()
  );

  useEffect(() => {
    let convertedText = enteredText;
    if (markersWithoutDuplicates.size !== 0) {
      markersWithoutDuplicates.forEach((item: Markers, key: string) => {
        if (item.bitcoinName !== undefined) {
          //   console.log(key + ' - ' + item.symbol + ', ' + item.bitcoinName);
          convertedText = enteredText.replaceAll(key, item.bitcoinName);
        }
      });
    }
    setDisplayedText(convertedText);
  }, [markersWithoutDuplicates, enteredText]);

  const enteredTextHandling = (text: string) => {
    setEnteredText(text);
    const pattern = /{{ (\w+)\/(\w+) }}/gim;
    let result = [...text.matchAll(pattern)];
    // console.log(result);
    if (result.length !== findedMarkersQuantity) {
      result.forEach((item) => {
        if (!markersWithoutDuplicates.has(item[0])) {
          setMarkersWithoutDuplicates(
            new Map(
              markersWithoutDuplicates.set(item[0], {
                type: item[1],
                symbol: item[2],
                bitcoinName: undefined,
              })
            )
          );
        }
      });
      setFindedMarkersQuantity(result.length);
      fetchingDataHandling();
    }
  };

  const fetchingDataHandling = () => {
    // console.log('Markers size: ' + markersWithoutDuplicates.size);
    // console.log(markersWithoutDuplicates);
    markersWithoutDuplicates.forEach(async (item: Markers, key: string) => {
      //   console.log(item.bitcoinName);
      if (item.bitcoinName === undefined) {
        try {
          console.log('Go');
          const res: AxiosResponse<AxiosResponseOfName> = await axios.get(
            `https://api.coinpaprika.com/v1/search/?q=${item.symbol}&c=currencies&modifier=symbol_search&limit=1`
          );
          if (res.data) {
            setMarkersWithoutDuplicates(
              new Map(
                markersWithoutDuplicates.set(key, {
                  ...item,
                  bitcoinName: res.data.currencies[0].name,
                })
              )
            );
            // console.log(markersWithoutDuplicates);
          }
        } catch (err: any) {
          console.log(err.response);
        }
      }
    });
  };

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
            <EnterArea getContentText={enteredTextHandling} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <DisplayArea convertedText={displayedText} />
            <button
              onClick={() => {
                console.log(markersWithoutDuplicates);
                console.log(enteredText);
              }}
            >
              Test
            </button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default MainPage;
