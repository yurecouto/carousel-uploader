/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Box, IconButton, Typography } from '@mui/material'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

import { ChangeEvent, useEffect, useState } from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import Item from './components/Item';
import { HiddenInput } from './components/HiddenInput';
import Scroll from './components/Scroll';

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [reload, setReload] = useState(true)
  const [selected, setSelected] = useState(0)
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target ? e.target.files : e as unknown as any[];
    const imagesArray: string[] = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagesArray.push(reader.result as string);
          if (imagesArray.length === files.length) {
            setImages((prevState) => prevState.concat(imagesArray));
            handleScroll(imagesArray.length)
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }

    setIsDragging(false)
  };

  const handleRemoveImage = (image: string) => {
    setImages(images.filter(i => i !== image))
    setReload(false)
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = (n: number) => {
    const element = document.getElementById("scroll-image");

    if (element) {
      element.scrollLeft = n * 260
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageChange as unknown as <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void,
  });

  useEffect(() => {
    if (!reload) {
      setReload(true)
    }
  }, [images, reload])

  useEffect(() => {
    const handleDragOver = (event: any) => {
      // Evita o comportamento padrão que impediria a detecção do evento dragenter
      event.preventDefault();
      setIsDragging(true);
      console.log('Mouse entrou na janela e começou a arrastar.');
    };

    const handleDragLeave = () => {
      setIsDragging(false);
      console.log('Mouse saiu da janela ou parou de arrastar.');
    };

    // Adiciona os ouvintes de eventos à janela (window)
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);

    // Remove os ouvintes de eventos ao desmontar o componente
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
    };
  }, []);

  useEffect(() => {
    handleScroll(selected)
  }, [handleScroll, selected])

  return (
    <Box 
      width={"100%"} 
      height={"100vh"} 
      display={"flex"} 
      flexDirection={"column"}
      alignItems={"center"} 
      justifyContent={images.length > 0 ? "space-evenly" : "center"} 
      bgcolor={"#f6f7f8"}
    >
      <Box
        width={"40%"}
        display={"flex"} 
        flexDirection={"row"}
        alignItems={"center"} 
      >
        <IconButton 
          sx={{height: 56, width: 56}}
          onClick={() => setSelected((prevState) => prevState - 1 >= 0 ? prevState - 1 : prevState)}
        >
          <ArrowLeftRoundedIcon sx={{height: 56, width: 56}}/>
        </IconButton>
        
        <Box
          {...getRootProps()} 
          component={"button"}
          display={"flex"} 
          flexDirection={images.length === 0 ? "column" : "row"}
          alignItems={"center"} 
          justifyContent={images.length === 0 ? "center" : "flex-start"} 
          width={"100%"}
          height={"280px"}
          padding={2}
          sx={{
            border: "2px dotted #83b4ff",
            bgcolor: isDragging ? "#8f8f8f" : "#ffffff",
            borderRadius: "8px",
          }}
        >
          {images.length === 0 && !isDragging && (
            <Button 
              component="label" 
              variant="outlined" 
              sx={{ 
                height: "40px", 
                borderRadius: "20px", 
                boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)'
              }} 
              startIcon={
                <FileUploadRoundedIcon />
              }
            >
              Upload file
              <HiddenInput {...getInputProps()} onChange={handleImageChange} type="file" multiple  />
            </Button>
          )}

          {images.length === 0 && !isDragging && (
            <Box 
              width={"50%"}
              display={"flex"} 
              flexDirection={"column"}
              alignItems={"center"} 
              justifyContent={"center"} 
              mt={1}
            >
              <Typography variant="body2" gutterBottom>
                Or
              </Typography>
              <Typography variant="body2" gutterBottom>
                Drag and drop a file here.
              </Typography>
            </Box>
          )}

          <Scroll isDragging={isDragging}>
            {images.length !== 0 && (
              <Box 
                display={"flex"} 
                flexDirection={"column"}
                alignItems={"center"} 
                justifyContent={"center"} 
                sx={{
                  width: '240px', 
                  height: '240px',
                  bgcolor: "#e3e3e3",
                  borderRadius: "4px"
                }}
                mr={2}
              >
                <AddIcon/>
                <Typography width={"240px"} variant="body2" gutterBottom>
                  Add new Images
                </Typography>
              </Box>
            )}
                        
            {images.map((image, index) => (
              <Item 
                id={"test" + index.toString()}
                key={index} 
                alt={`carousel-${index}`} 
                image={image}
                close={() => handleRemoveImage(image)}
                selected={selected === index}
              />
            ))}
          </Scroll>

          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display={"flex"} 
            flexDirection={"column"}
            alignItems={"center"} 
            justifyContent={"center"}  // Fundo semi-transparente mais escuro
            visibility={isDragging ? 'visible' : 'hidden'}
          >
            <UploadIcon/>
            <Typography width={"240px"} variant="body1" gutterBottom>
              Add new Images
            </Typography>
          </Box>
          <HiddenInput {...getInputProps()} onChange={handleImageChange} type="file" multiple  />
        </Box>

        <IconButton 
          sx={{height: 56, width: 56}}
          onClick={() => setSelected((prevState) => prevState + 1 <= (images.length - 1) ? prevState + 1 : prevState)}
        >
          <ArrowRightRoundedIcon sx={{height: 56, width: 56}}/>
        </IconButton>
      </Box>
    </Box>
  )
}

export default App
