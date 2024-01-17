/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

// eslint-disable-next-line react-refresh/only-export-components
function Item({image, alt, close, selected}: any ) {
    const [isHovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
      setHovered(true);
    };

    const handleMouseLeave = () => {
      setHovered(false);
    };

    return (
      <Box
        display={"inline-block"}
        position={"relative"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        overflow={"hidden"}
        mr={2}
        width={"auto"}
        border={"2px solid"}
        borderColor={selected ? "primary.main" : "#e0e3e6"}
        borderRadius={2}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
        <img
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          alt={alt}
          src={image}
          style={{
            width: '240px',
            height: '240px',
            filter: isHovered ? "blur(1.5px)" : "none",
            display: "block"
          }}
        />

        {isHovered && (
          <IconButton
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={close}
            sx={{position: "absolute", top: 0, right: 0, color: "error.light"}}
          >
            <HighlightOffTwoToneIcon/>
          </IconButton>
        )}
        </Box>


      </Box>
    );
  }

  export default Item;
