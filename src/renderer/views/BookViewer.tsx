import { Button, Flex, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure, Text, Input, Select, Textarea, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import BookItem from '../components/BookItem';
import db from '../sql';

export default function BookViewer() {
  const toast = useToast();

  const [books, setBooks] = useState(new Array(0));
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [authors, setAuthors] = useState(new Array(0))
  const [publishers, setPublishers] = useState(new Array(0))

  const [author, setAuthor] = useState(-1)
  const [publisher, setPublisher] = useState(-1)
  const [intro, setIntro] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    const fetchData = async() => {
      db.getBooks().then(b => setBooks(b));
      db.getPublishers().then((p) => {
        console.log(p)
        setPublishers(p)
      });
      db.getAuthors().then(d => setAuthors(d))
    }
    fetchData();
  }, []);

  const handleBookName = (e) => {
    setName(e.target.value);
  }
  const handleIntro = (e) => {
    setIntro(e.target.value);
  }
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  }
  const handlePublisher = (e) => {
    setPublisher(e.target.value);
  }

  const createBook = (e) => {
    db.InsertOneBook(name, intro, author, publisher).then((r) => {
      if (r == 'fail') {
        toast({
          description: 'Something went wrong',
          status: 'error',
          isClosable: true,
        });
      } else {
        toast({
          description: 'Success',
          status: 'success',
          isClosable: true,
        });
        db.getBooks().then((r) => {
          setBooks(r);
        })
        onClose();
      }
    });
  }

  return <>
    <Stack direction='column'>
      <BookItem name='Johnny walker' author='Larry' />
      {books.map((b) => (
        <BookItem name={b.name} author={b.author} />
      ))}
    </Stack>
    <Flex
      position='fixed'
      right='10'
      bottom='10'
    >
      <IconButton colorScheme='cyan' icon={<FiPlus color='white' />} aria-label='Add a new book' size='lg' onClick={onOpen}/>
    </Flex>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a New Book</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text marginLeft='5px' marginBottom='5px'>Book Title</Text>
          <Input placeholder='Enter Book Title' onChange={handleBookName} />
          <Text marginLeft='5px' marginBottom='5px'>Author</Text>
          <Select placeholder='Select Author' onChange={handleAuthor}>
            {authors.map((a, i, arr) => (
              <option value={i}>{a.name}</option>
            ))}
          </Select>
          <Text marginLeft='5px' marginBottom='5px'>Publisher</Text>
          <Select placeholder='Select Publisher' onVolumeChange={handlePublisher}>
            {publishers.map((p, i, arr) => {
              // console.log(arr);
              return <option value={i}>{p.name}</option>
            })}
          </Select>
          <Text marginLeft='5px' marginBottom='5px'>Description</Text>
          <Textarea
            backgroundColor="white"
            placeholder="Enter some Description"
            onChange={handleIntro}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' marginRight='10px' onClick={createBook}>
              Add
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
              Quit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
}
