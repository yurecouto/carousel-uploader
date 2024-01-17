/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { Button, Box, IconButton, Typography } from '@mui/material'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ArrowLeftRoundedIcon from '@mui/icons-material/ArrowLeftRounded';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import { HiddenInput } from './HiddenInput';
import Scroll from './Scroll';
import Item from './Item';



function CarouselUploader() {
  const [images, setImages] = useState<string[]>([]);
  const [reload, setReload] = useState(true)
  const [selected, setSelected] = useState(0)
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingNonImage, setIsDraggingNonImage] = useState(false);

  const isImage = (file: any) => {
    return file.type.startsWith('image/');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target ? e.target.files: e as unknown as any[];
    const imagesArray: string[] = [];
    const errorIndexes: number[] = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (!isImage(files[i])) {
          setIsDraggingNonImage(true)
          errorIndexes.push(i)
          return
        }
      }
    }

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          !errorIndexes.includes(i) && imagesArray.push(reader.result as string);
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
      event.preventDefault();
      setIsDragging(true);
      setIsDraggingNonImage(false)
    };

    const handleDragLeave = () => {
      setIsDragging(false);
      setIsDraggingNonImage(false)
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);

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
          display={"flex"}
          flexDirection={images.length === 0 ? "column" : "row"}
          alignItems={"center"}
          justifyContent={images.length === 0 ? "center" : "flex-start"}
          width={"100%"}
          height={"280px"}
          px={2}
          border={"2px dotted"}
          borderColor={"primary.light"}
          bgcolor={(isDragging || isDraggingNonImage) ? "commom.grey" : "#ffffff"}
          borderRadius={2}
        >
          {!isDraggingNonImage && images.length === 0 && !isDragging && (
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

          {!isDraggingNonImage && images.length === 0 && !isDragging && (
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

          <Scroll isDragging={isDragging || isDraggingNonImage}>
            {images.length !== 0 && (
              <Box
                display={"inline-block"}
                position={"relative"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDirection={"column"}
                overflow={"hidden"}
                mr={2}
                border={"2px dotted"}
                borderColor={"primary.main"}
                borderRadius={2}
                sx={{backgroundColor: "#e7eaeb"}}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                  width={"240px"}
                  height={"240px"}
                >
                  <AddIcon/>
                  <Typography variant="body2" gutterBottom>
                    Add new Images
                  </Typography>
                </Box>
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
            justifyContent={"center"}
            visibility={(isDragging && !isDraggingNonImage) ? 'visible' : 'hidden'}
          >
            <UploadIcon/>
            <Typography variant="body1" gutterBottom>
              Add new Images
            </Typography>
          </Box>

          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            visibility={isDraggingNonImage ? 'visible' : 'hidden'}
          >
            <ErrorIcon color='error'/>
            <Typography variant="body1" gutterBottom>
              Error uploading images. Make sure all files have valid image extensions.
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

export default CarouselUploader
