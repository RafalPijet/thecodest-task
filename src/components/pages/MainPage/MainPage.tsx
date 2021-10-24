import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Grid } from '@material-ui/core';
import EnterArea from '../../features/EnterArea/EntarArea';
import DisplayArea from '../../features/DisplayArea/DisplayArea';
import { useStyles } from './MainPageStyle';
import {
  Markers,
  AxiosResponseOfName,
  KeyAvailable,
  Entry,
} from '../../../types';
import image from '../../../images/background.jpg';

const MainPage: React.FC = () => {
  const classes = useStyles();
  const pattern = /{{ (\w+)\/(\w+) }}/gim;
  const [isPending, setIsPending] = useState<boolean>(false);
  const [enteredText, setEnteredText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [findedMarkersQuantity, setFindedMarkersQuantity] = useState<number>(0);
  const [markersWithoutDuplicates, setMarkersWithoutDuplicates] = useState(
    new Map<string, Markers>()
  );
  const [quantity, setQuantity] = useState<Entry[]>([]);

  useEffect(() => {
    const result = displayedText.match(pattern);
    if (result !== null && result.length && quantity.length !== 0) {
      fetchingNameHandling();
      console.log('Error');
    }
  }, [displayedText, quantity]);

  useEffect(() => {
    // let counter = 0;
    // markersWithoutDuplicates.forEach((item: Markers) => {
    //   if (item.type === KeyAvailable.value && item.name !== undefined) {
    //     counter++;
    //     console.log(counter);
    //     console.log(quantity.length);
    //   }
    // });
    if (enteredText.includes(KeyAvailable.value) && quantity.length !== 0) {
      //   setIsValueFetching(true);
      //   console.log(quantity);
      //   console.log(markersWithoutDuplicates);
      fetchingValueHandling(quantity);
    }
  }, [enteredText, quantity]);

  useEffect(() => {
    // if (!isPending) {
    //   fetchingValueHandling();
    // }
    let convertedText = enteredText;
    if (markersWithoutDuplicates.size !== 0 && !isPending) {
      markersWithoutDuplicates.forEach((item: Markers, key: string) => {
        if (item.type === KeyAvailable.name && item.name !== undefined) {
          convertedText = convertedText.replaceAll(key, item.name);
        }
        if (item.type === KeyAvailable.value && item.name !== undefined) {
          item.value !== undefined
            ? (convertedText = convertedText.replaceAll(key, item.value))
            : (convertedText = convertedText.replaceAll(
                key,
                `Value for ${item.name} isn't available!!!`
              ));
        }
      });
    }
    if (!isPending) {
      setDisplayedText(convertedText);
    }
  }, [enteredText, markersWithoutDuplicates]);

  const enteredTextHandling = (text: string) => {
    setEnteredText(text);
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
    let test: any[] = [];
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
            if (item.type === KeyAvailable.value) {
              //   console.log(res.data.currencies[0].name);
              const entry: Entry = {
                key,
                item: {
                  ...item,
                  name: res.data.currencies[0].name,
                },
              };
              test.push(entry);
              setQuantity(test);
            }
          }
          setIsPending(false);
        } catch (err: any) {
          console.log(err.response);
          setIsPending(false);
        }
      }
    });
  };

  const fetchingValueHandling = (entry: Entry[]) => {
    console.log('fetchingValueHandling');
    // console.log(markersWithoutDuplicates);
    // console.log(quantity);
    setQuantity([]);
    entry.forEach(async (item: Entry) => {
      // console.log(item);
      try {
        setIsPending(true);
        console.log('Go Value');
        const res: AxiosResponse<any> = await axios.get(
          `https://api.coinpaprika.com/v1/tickers?quotes=USD,${item.item.symbol}`
        );
        if (res.data) {
          const result = res.data[0].quotes.USD.price.toFixed(2);
          setMarkersWithoutDuplicates(
            new Map(
              markersWithoutDuplicates.set(item.key, {
                ...item.item,
                value: `1 ${item.item.name} = ${result} USD`,
              })
            )
          );
        }
        setIsPending(false);
      } catch (err: any) {
        console.log(err.response);
        console.log(item.key);
        let text = enteredText.slice(0, enteredText.length);
        text = text.replace('Value/BITGOLD', 'Error');
        console.log(text);
        setEnteredText('www');
        setIsPending(false);
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
            <button
              onClick={() => {
                console.log(markersWithoutDuplicates);
                console.log(quantity);
              }}
            >
              Show Map
            </button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default MainPage;
