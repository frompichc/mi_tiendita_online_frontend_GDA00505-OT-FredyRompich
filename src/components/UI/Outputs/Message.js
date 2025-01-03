import React from 'react';

function Message({ type, children }) {
  const styles = {
    error: { color: 'red', textAlign: 'center' },
    loading: { color: 'blue', textAlign: 'center' },
    info: { color: 'gray', textAlign: 'center' },
  };

  return <p style={styles[type] || styles.info}>{children}</p>;
}

export default Message;