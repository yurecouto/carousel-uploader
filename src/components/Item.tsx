/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';


// eslint-disable-next-line react-refresh/only-export-components
function Item({image, alt, close, selected, ref}: any ) {
    const [isHovered, setHovered] = useState(false);
  
    const handleMouseEnter = () => {
      setHovered(true);
    };
  
    const handleMouseLeave = () => {
      setHovered(false);
    };
  
    return (
      <Box
        ref={ref}  // Adiciona uma referência para o item
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        width={"auto"}
        mr={2}
      >
        <img
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          alt={alt}
          src={image}
          style={{ 
            width: '240px', 
            height: '240px',
            borderRadius: "4px",
            border: "2px solid",
            borderColor:selected ? "green" : "#e0e3e6" , 
            filter: isHovered ? "blur(1.5px)" : "none"
          }}
        />
  
        {isHovered && (
          <IconButton 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ position: "absolute"}}
            onClick={close}
          >
            <DeleteRoundedIcon color="error"/>
          </IconButton>
        )}
      </Box>
    );
  }
  
  export default Item;