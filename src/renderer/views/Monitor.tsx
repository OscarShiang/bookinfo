import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import TableViewer from '../components/TableViewer';
import db from '../sql';

export default function Monitor() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [table, setTable] = useState([]);
  const [authors, setAuthors] = useState(new Array(0));
  const [publishers, setPublishers] = useState(new Array(0));
  const [author, setAuthor] = useState(-1);
  const [publisher, setPublisher] = useState(-1);
  const [intro, setIntro] = useState('');
  const [name, setName] = useState('');
  const [update, setUpdate] = useState(false);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      db.getPublishers().then((p) => {
        console.log(p);
        setPublishers(p);
      });
      db.getAuthors().then((d) => setAuthors(d));
      db.getBooks().then((d) => setBooks(d));
    };
    fetchData();
  }, []);

  function submit(cmd: string, alter = false) {
    if (!alter) {
      db.query(cmd).then((res) => {
        console.log(res);
        if (res.status === 'fail') {
          toast({
            description: 'Something went wrong',
            status: 'error',
            position: 'bottom-right',
            isClosable: true,
          });
        } else {
          setTable(res.data);
          toast({
            description: 'Success',
            position: 'bottom-right',
            isClosable: true,
          });
        }
      });
    } else {
      db.alter(cmd).then((res) => {
        console.log(res);
        if (res === 'fail') {
          toast({
            description: 'Something went wrong',
            status: 'error',
            isClosable: true,
          });
        } else {
          setTable([]);
          toast({
            description: 'Success',
            isClosable: true,
          });
        }
      });
    }
  }

  const handleBookName = (e) => {
    setName(e.target.value);
  };
  const handleIntro = (e) => {
    setIntro(e.target.value);
  };
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };
  const handlePublisher = (e) => {
    console.log(e.target.value);
    setPublisher(e.target.value);
  };
  const handleAdd = () => {
    setUpdate(false);
    setName('');
    setPublisher(-1);
    setAuthor(-1);
    setIntro('');

    onOpen();
  };
  const handleEdit = () => {
    setUpdate(true);
    setName('');
    setPublisher(-1);
    setAuthor(-1);
    setIntro('');

    onOpen();
  };
  const handleBooks = (e) => {
    setBook(e.target.value);
  };

  const getBooks = () => {
    // submit('SELECT bid, b.name AS bookname, a.name AS author, p.name AS publisher, b.intro AS intro FROM book AS b, author AS a, publisher AS p WHERE b.author == a.aid AND b.publisher == p.pid');
    submit('SELECT * FROM book');
  };

  const addBook = () => {
    if (!update)
      submit(
        `INSERT INTO book (name, intro, author, publisher) VALUES ("${name}", "${intro}", ${author}, ${publisher})`,
        true
      );
    else {
      submit(`UPDATE book SET intro = "${intro}" WHERE bid == ${book}`);
    }
    onClose();
  };

  const deleteLastBook = () => {
    submit(`DELETE FROM book WHERE bid == (SELECT MAX(bid) FROM book)`);
  };

  const getTaiwanesePubl = () => {
    submit(`SELECT * FROM publisher WHERE location IN ('Taiwan')`);
  };

  const getPublNotInTW = () => {
    submit(`SELECT * FROM publisher WHERE location NOT IN ('Taiwan')`);
  };

  const getBooksWithCmt = () => {
    submit(
      `SELECT * FROM book WHERE EXISTS (SELECT * FROM comment WHERE comment_to == bid)`
    );
  };

  const getBooksNoCmt = () => {
    submit(
      `SELECT * FROM book WHERE NOT EXISTS (SELECT * FROM comment WHERE comment_to == bid)`
    );
  };

  const getCmtPerReader = () => {
    submit(
      `SELECT rid, name, COUNT(cid) AS cnt FROM reader, comment WHERE author == rid GROUP BY rid;`
    );
  };

  const getNumTxtPerReader = () => {
    submit(
      `SELECT rid, SUM(len) FROM (SELECT rid, LENGTH(content) AS len FROM reader, comment WHERE reader.rid == comment.author) GROUP BY rid`
    );
  };

  const getBookWithMaxCmt = () => {
    submit(
      'SELECT bid, name, MAX(cmt) FROM (SELECT bid, book.name AS name, COUNT(cid) AS cmt, pid FROM book, publisher, comment WHERE bid == comment_to AND book.publisher == publisher.pid AND publisher.pid == 7 GROUP BY comment_to) GROUP BY pid'
    );
  };

  const getBookWithMinCmt = () => {
    submit(
      'SELECT bid, name, MIN(cmt) FROM (SELECT bid, book.name AS name, COUNT(cid) AS cmt, pid FROM book, publisher, comment WHERE bid == comment_to AND book.publisher == publisher.pid AND publisher.pid == 7 GROUP BY comment_to) GROUP BY pid'
    );
  };

  const getAvgCmtPerReader = () => {
    submit(
      'SELECT AVG(cmt) FROM (SELECT rid, COUNT(cid) AS cmt FROM reader, comment WHERE author == rid GROUP BY author)'
    );
  };

  const getAuthorWith2moreBooks = () => {
    submit(
      'SELECT aid, author.name AS name, COUNT(bid) AS cnt FROM author, book WHERE aid == book.author GROUP BY aid HAVING cnt >= 2'
    );
  };

  return (
    <Stack direction="column">
      <Stack direction="row">
        <Button color="white" colorScheme="cyan" onClick={getBooks}>
          Books
        </Button>
        <Button color="white" colorScheme="cyan" onClick={deleteLastBook}>
          Delete Last Book
        </Button>
        <Button color="white" colorScheme="cyan" onClick={handleAdd}>
          Add Book
        </Button>
        <Button color="white" colorScheme="cyan" onClick={handleEdit}>
          Edit Book
        </Button>
        <Button color="white" colorScheme="cyan" onClick={getTaiwanesePubl}>
          Taiwanese Publishers
        </Button>
      </Stack>
      <Stack direction="row">
        <Button color="white" colorScheme="cyan" onClick={getPublNotInTW}>
          Publishers not in Taiwan
        </Button>
        <Button color="white" colorScheme="cyan" onClick={getBooksWithCmt}>
          Books with Comments
        </Button>
        <Button color="white" colorScheme="cyan" onClick={getBooksNoCmt}>
          Books with no Comments
        </Button>
      </Stack>
      <Stack direction="row">
        <Button color="white" colorScheme="cyan" onClick={getCmtPerReader}>
          Number of Comments per Reader
        </Button>
        <Button color="white" colorScheme="cyan" onClick={getNumTxtPerReader}>
          Number of Characters in All Comments
        </Button>
      </Stack>
      <Stack direction="row">
        <Button color="white" colorScheme="cyan" onClick={getBookWithMaxCmt}>
          Most Popular book in 幼獅文化
        </Button>
        <Button color="white" colorScheme="cyan" onClick={getBookWithMinCmt}>
          Least Popular book in 幼獅文化
        </Button>
        <Button color="white" colorScheme="cyan" onClick={getAvgCmtPerReader}>
          Average Comment per Reader
        </Button>
      </Stack>
      <Stack direction="row">
        <Button
          color="white"
          colorScheme="cyan"
          onClick={getAuthorWith2moreBooks}
        >
          Author written 2+ books
        </Button>
      </Stack>

      <TableViewer table={table} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {!update ? (
            <ModalHeader>Add a New Book</ModalHeader>
          ) : (
            <ModalHeader>Edit Book Info</ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>
            {update ? (
              <Text marginLeft="5px" marginBottom="5px">
                Choose Your Book
              </Text>
            ) : (
              <></>
            )}
            {update ? (
              <Select placeholder="Select a Book" onChange={handleBooks}>
                {books.map((b, i) => (
                  <option value={i + 1}>{b.name}</option>
                ))}
              </Select>
            ) : (
              <></>
            )}

            {!update ? (
              <Text marginLeft="5px" marginBottom="5px">
                Book Title
              </Text>
            ) : (
              <></>
            )}
            {!update ? (
              <Input placeholder="Enter Book Title" onChange={handleBookName} />
            ) : (
              <></>
            )}
            {!update ? (
              <Text marginLeft="5px" marginBottom="5px">
                Author
              </Text>
            ) : (
              <></>
            )}
            {!update ? (
              <Select placeholder="Select Author" onChange={handleAuthor}>
                {authors.map((a, i) => (
                  <option value={i + 1}>{a.name}</option>
                ))}
              </Select>
            ) : (
              <></>
            )}
            {!update ? (
              <Text marginLeft="5px" marginBottom="5px">
                Publisher
              </Text>
            ) : (
              <></>
            )}
            {!update ? (
              <Select placeholder="Select Publisher" onChange={handlePublisher}>
                {publishers.map((p, i) => (
                  <option value={i + 1}>{p.name}</option>
                ))}
              </Select>
            ) : (
              <></>
            )}

            <Text marginLeft="5px" marginBottom="5px">
              Description
            </Text>
            <Textarea
              backgroundColor="white"
              placeholder="Enter some Description"
              onChange={handleIntro}
            />
          </ModalBody>

          <ModalFooter>
            {!update ? (
              <Button colorScheme="blue" marginRight="10px" onClick={addBook}>
                Add
              </Button>
            ) : (
              <Button colorScheme="blue" marginRight="10px" onClick={addBook}>
                Update
              </Button>
            )}

            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Quit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
