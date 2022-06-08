const { ipcRenderer } = window.electron;

export default function query(sql: string) {
  return new Promise((resolve) => {
    ipcRenderer.once('db-reply', (d) => {
      resolve(d);
    });
    ipcRenderer.sendMessage('db-cmd', sql);
  });
}
