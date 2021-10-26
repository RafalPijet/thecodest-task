import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Grid, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import EnterArea from '../../features/EnterArea/EntarArea';
import DisplayArea from '../../features/DisplayArea/DisplayArea';
import { useStyles } from './MainPageStyle';
import {
  Markers,
  AxiosResponseOfName,
  KeyAvailable,
  Entry,
  ErrorMarker,
} from '../../../types';
import image from '../../../images/background.jpg';

const MainPage: React.FC = () => {
  const classes = useStyles();
  const pattern = /{{ (\w+)\/(\w+) }}/gim;
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<ErrorMarker>({
    isError: false,
    message: '',
  });
  const [isPending, setIsPending] = useState<boolean>(false);
  const [enteredText, setEnteredText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [correctlyText, setCorrectlyText] = useState<string | null>(null);
  const [findedMarkersQuantity, setFindedMarkersQuantity] = useState<number>(0);
  const [markersWithoutDuplicates, setMarkersWithoutDuplicates] = useState(
    new Map<string, Markers>()
  );
  const [valuesEntry, setSetValuesEntry] = useState<Entry[]>([]);

  useEffect(() => {
    const result = displayedText.match(pattern);
    if (error.isError) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    if (result !== null && result.length && correctlyText !== null) {
      let textOfDisplay = displayedText;
      result.forEach((item: string) => {
        if (displayedText.includes(item)) {
          textOfDisplay = textOfDisplay.replace(item, '');
          console.log('Error');
        }
      });
      setDisplayedText(textOfDisplay);
    }
  }, [error.isError, displayedText]);

  useEffect(() => {
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
                `Value for ${key} isn't available!!!`
              ));
        }
      });
    }
    if (!isPending) {
      setDisplayedText(convertedText);
    }
  }, [enteredText, markersWithoutDuplicates, correctlyText, isPending]);

  useEffect(() => {
    if (enteredText.includes(KeyAvailable.value) && valuesEntry.length !== 0) {
      fetchingValueHandling(valuesEntry);
    }
  }, [enteredText, valuesEntry]);

  const enteredTextHandling = (text: string) => {
    setCorrectlyText(null);
    setEnteredText(text);
    let result = [...text.matchAll(pattern)];
    if (result.length !== findedMarkersQuantity) {
      result.forEach((item) => {
        if (!markersWithoutDuplicates.has(item[0])) {
          setMarkersWithoutDuplicates(
            new Map(
              markersWithoutDuplicates.set(item[0], {
                id: undefined,
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
    let entrys: Entry[] = [];
    markersWithoutDuplicates.forEach(async (item: Markers, key: string) => {
      if (item.name === undefined) {
        try {
          setIsPending(true);
          console.log('Go Name');
          const res: AxiosResponse<AxiosResponseOfName> = await axios.get(
            `https://api.coinpaprika.com/v1/search/?q=${item.symbol}&c=currencies&modifier=symbol_search&limit=1`
          );
          if (res.data.currencies.length) {
            setMarkersWithoutDuplicates(
              new Map(
                markersWithoutDuplicates.set(key, {
                  ...item,
                  id: res.data.currencies[0].id,
                  name: res.data.currencies[0].name,
                })
              )
            );
            if (item.type === KeyAvailable.value) {
              const entry: Entry = {
                key,
                item: {
                  ...item,
                  id: res.data.currencies[0].id,
                  name: res.data.currencies[0].name,
                },
              };
              entrys.push(entry);
              setSetValuesEntry(entrys);
            }
            setIsPending(false);
          } else {
            errorHandling(false, key);
          }
        } catch (err: any) {
          errorHandling(true, key, err);
        }
      }
    });
  };

  const fetchingValueHandling = (entry: Entry[]) => {
    setSetValuesEntry([]);
    entry.forEach(async (item: Entry) => {
      try {
        setIsPending(true);
        console.log('Go Value');
        const res: AxiosResponse<any> = await axios.get(
          `https://api.coinpaprika.com/v1/tickers/${item.item.id}`
        );
        if (res.data) {
          const result = res.data.quotes.USD.price.toFixed(2);
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
        errorHandling(true, item.key, err);
      }
    });
  };

  const errorHandling = (isError: boolean, key: string, err?: any) => {
    if (isError && err !== undefined) {
      if (err.response.status === 404) {
        setError({
          isError: true,
          message: `For marker ${key} ${err.response.data.error}!!! Value isn't available!!!`,
        });
      } else if (err.response.status === 429) {
        setError({ isError: true, message: 'Too many requests' });
      } else {
        setError({ isError: true, message: 'Something went wrong' });
      }
    }
    if (!isError) {
      setError({
        isError: true,
        message: `Marker ${key} isn't correctly. If exist incorrect marker, you gotta remove them`,
      });
    }
    setCorrectlyText(enteredText.replace(key, ''));
    markersWithoutDuplicates.delete(key);
    const changedMap = new Map(markersWithoutDuplicates);
    changedMap.delete(key);
    setMarkersWithoutDuplicates(changedMap);
    setError({ isError: false, message: '' });
    setIsPending(false);
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
          <Grid item xs={12} sm={12} md={12}>
            <Typography className={classes.title} align="center" variant="h5">
              Cryptocurrency Markers Converter
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <EnterArea
              setCorrectlyText={correctlyText}
              getContentText={enteredTextHandling}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <DisplayArea convertedText={displayedText} isPending={isPending} />
            <button
              onClick={() => {
                console.log(markersWithoutDuplicates);
                console.log(valuesEntry);
                console.log(isPending);
                console.log(error);
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
