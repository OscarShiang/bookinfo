const { ipcRenderer } = window.electron;

const query = async (sql: string) => {
  return new Promise((resolve) => {
    ipcRenderer.once('db-reply', (d) => {
      resolve(d);
    });
    ipcRenderer.sendMessage('db-cmd', sql);
  });
};

const alter = async (sql: string) => {
  return new Promise((resolve) => {
    ipcRenderer.once('db-alter-reply', (d) => {
      resolve(d);
    });
    ipcRenderer.sendMessage('db-alter', sql);
  });
};

const getAuthors = () => {
  return new Promise((resolve) => {
    ipcRenderer.once('authors-reply', (d) => {
      resolve(d);
    });
    ipcRenderer.sendMessage('authors', '');
  });
};

const getPublishers = () => {
  return new Promise((resolve) => {
    ipcRenderer.once('publishers-reply', (d) => {
      resolve(d);
    });
    ipcRenderer.sendMessage('publishers', '');
  });
};

const getBooks = async () => {
  return new Promise((resolve) => {
    ipcRenderer.once('books-reply', (d) => {
      resolve(d);
    });
    ipcRenderer.sendMessage('books', '');
  });
};

const getOneBook = async (bid: number) => {
  return new Promise((res) => {
    query(
      `SELECT book.name AS name, book.intro AS intro, author.name AS author, publisher.name AS publisher FROM book, author, publisher WHERE book.bid == ${bid} AND book.author == author.aid AND book.publisher == publisher.pid;`
    ).then((r) => {
      res(r.data);
    });
  });
};

const getCommentsForBook = async (bid: number) => {
  return new Promise((res) => {
    query(
      `SELECT reader.name AS author, content FROM reader, comment WHERE reader.rid == comment.author AND comment_to == ${bid};`
    ).then((r) => {
      res(r.data);
    });
  });
};

const InsertOneBook = async (
  name: string,
  intro: string,
  author: number,
  publisher: number
) => {
  return new Promise((res) => {
    query(
      `INSERT INTO book (name, intro, author, publisher) VALUES ("${name}", "${intro}", ${author}, ${publisher})`
    ).then((r) => {
      res(r.status);
    });
  });
};

const InsertOneComment = async (
  author: number,
  content: string,
  comment_to: number
) => {
  return new Promise((res) => {
    query(
      `INSERT INTO comment (author, content, comment_to) VALUES (${author}, "${content}", ${comment_to})`
    ).then((r) => {
      res(r.status);
    });
  });
};

export default {
  query,
  alter,
  getAuthors,
  getPublishers,
  getBooks,
  getOneBook,
  getCommentsForBook,
  InsertOneBook,
  InsertOneComment,
};
