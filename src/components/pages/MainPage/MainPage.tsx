import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Grid } from '@material-ui/core';
import EnterArea from '../../features/EnterArea/EntarArea';
import DisplayArea from '../../features/DisplayArea/DisplayArea';
import { useStyles } from './MainPageStyle';
import { Markers, AxiosResponseOfName, KeyAvailable } from '../../../types';
import image from '../../../images/background.jpg';

const MainPage: React.FC = () => {
  const classes = useStyles();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [enteredText, setEnteredText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [findedMarkersQuantity, setFindedMarkersQuantity] = useState<number>(0);
  const [markersWithoutDuplicates, setMarkersWithoutDuplicates] = useState(
    new Map<string, Markers>()
  );

  useEffect(() => {
    if (!isPending && markersWithoutDuplicates.size !== 0) {
      console.log('Effect');
      fetchingValueHandling();
    }
  }, [isPending]);

  useEffect(() => {
    // if (!isPending) {
    //   fetchingValueHandling();
    // }
    let convertedText = enteredText;
    if (markersWithoutDuplicates.size !== 0) {
      markersWithoutDuplicates.forEach((item: Markers, key: string) => {
        if (item.type === KeyAvailable.name && item.name !== undefined) {
          convertedText = convertedText.replaceAll(key, item.name);
        }
        if (item.type === KeyAvailable.value && item.name !== undefined) {
          item.value !== undefined
            ? (convertedText = convertedText.replaceAll(key, item.value))
            : (convertedText = convertedText.replaceAll(
                key,
                `Value fot ${item.name} isn't available!!!`
              ));
        }
      });
    }
    setDisplayedText(convertedText);
  }, [enteredText, markersWithoutDuplicates]);

  const enteredTextHandling = (text: string) => {
    setEnteredText(text);
    const pattern = /{{ (\w+)\/(\w+) }}/gim;
    let result = [...text.matchAll(pattern)];
    if (result.length !== findedMarkersQuantity) {
      result.forEach((item) => {
        if (!markersWithoutDuplicates.has(item[0])) {
          setMarkersWithoutDuplicates(
            new Map(
              markersWithoutDuplicates.set(item[0], {
                type: item[1],
                symbol: item[2],
                name: undefined,
                value: undefined,
              })
            )
          );
        }
      });
      setFindedMarkersQuantity(result.length);
      fetchingNameHandling();
    }
  };

  const fetchingNameHandling = () => {
    markersWithoutDuplicates.forEach(async (item: Markers, key: string) => {
      if (item.name === undefined) {
        try {
          setIsPending(true);
          console.log('Go Name');
          const res: AxiosResponse<AxiosResponseOfName> = await axios.get(
            `https://api.coinpaprika.com/v1/search/?q=${item.symbol}&c=currencies&modifier=symbol_search&limit=1`
          );
          if (res.data) {
            setMarkersWithoutDuplicates(
              new Map(
                markersWithoutDuplicates.set(key, {
                  ...item,
                  name: res.data.currencies[0].name,
                })
              )
            );
          }
          setIsPending(false);
        } catch (err: any) {
          console.log(err.response);
          setIsPending(false);
        }
      }
    });
  };

  const fetchingValueHandling = () => {
    markersWithoutDuplicates.forEach(async (item: Markers, key: string) => {
      if (
        item.type === KeyAvailable.value &&
        item.name !== undefined &&
        item.value === undefined
      ) {
        console.log(item);
        try {
          setIsPending(true);
          console.log('Go Value');
          const res: AxiosResponse<any> = await axios.get(
            `https://api.coinpaprika.com/v1/tickers?quotes=USD,${item.symbol}`
          );
          if (res.data) {
            const result = res.data[0].quotes.USD.price.toFixed(2);
            setMarkersWithoutDuplicates(
              new Map(
                markersWithoutDuplicates.set(key, {
                  ...item,
                  value: `1 ${item.name} = ${result} USD`,
                })
              )
            );
          }
          setIsPending(false);
        } catch (err: any) {
          console.log(err.response);
          setIsPending(false);
        }
      }
    });
  };

  const test = async (symbol: string) => {
    try {
      const res: AxiosResponse<any> = await axios.get(
        `https://api.coinpaprika.com/v1/tickers?quotes=USD,${symbol}`
      );
      if (res.data) {
        console.log(res.data[0].quotes.USD.price.toFixed(2));
      }
    } catch (err: any) {
      console.log(err.response);
    }
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
                // console.log(markersWithoutDuplicates);
                // console.log(enteredText);
                test('BITGOLD');
              }}
            >
              Get value
            </button>
            <button onClick={() => console.log(markersWithoutDuplicates)}>
              Show Map
            </button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default MainPage;
