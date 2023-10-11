import * as React from 'react';
import Box from '@mui/joy/Box';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Typography from '@mui/joy/Typography';

export default function SegmentedControls({setAct, acts}) {
  const [justify, setJustify] = React.useState('Accept');
  // console.log(justify)
  return (

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb:2 }}>
      {/* {justify}<br/> */}
      <RadioGroup
        orientation="horizontal"
        aria-labelledby="segmented-controlsexample"
        name="justify"
        value={acts}
        // onChange={(event) => setJustify(event.target.value)}
        onChange={(event) => setAct(event.target.value)}
        sx={{
          minHeight: 48,
          padding: '4px',
          borderRadius: '12px',
          bgcolor: 'neutral.softBg',
          '--RadioGroup-gap': '4px',
          '--Radio-actionRadius': '8px',
        }}
      >
        {['accept', 'deny'].map((item) => (
          <Radio
            size='small'
            key={item}
            color="neutral"
            value={item}
            disableIcon
            label={item}
            variant="plain"
            sx={{
              px: 2,
              alignItems: 'center',
            }}
            slotProps={{
              action: ({ checked }) => {
                // console.log('checked:', checked); // Add this line to log the value of checked
                // console.log('item:', item);
                if (checked & item === "accept") {
                    setJustify("accept")
                    setAct("accept")
                } else if (checked & item === "deny") {
                    setJustify("deny")
                    setAct("deny")
                }
                return {
                  sx: {
                    ...(checked && {
                    //   bgcolor: 'background.surface',
                      bgcolor: 'background.surface',
                      boxShadow: 'sm',
                      '&:hover': {
                        bgcolor: 'background.surface',
                      },
                    }),
                  },
                };
              },
            }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}