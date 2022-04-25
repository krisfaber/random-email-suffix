import React, { useEffect, useState } from 'react';

import { Box, List, ListItem, Button, Divider } from '@chakra-ui/react';

import { GenerationHistory, HistoryPayload } from '../utils/history';

const generationHistory = new GenerationHistory();

const History = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HistoryPayload[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const d = await generationHistory.getHistory();

      setData(d.reverse());
      setLoading(false);
    })();
  }, [setLoading, setData]);

  return (
    <Box>
      {!loading && (
        <List spacing={3}>
          {data.map((h, i) => (
            <ListItem key={h.date}>
              <Box
                display="flex"
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Box>{h.email}</Box>
                <Button
                  type="button"
                  size={'xs'}
                  variant={'link'}
                  colorScheme={'teal'}
                  onClick={() => {
                    navigator.clipboard.writeText(h.email);
                  }}
                >
                  copy
                </Button>
              </Box>

              <Divider my={'2'} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default History;
