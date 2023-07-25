const Notification = ({ message }) => {
  const messageStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  const errorMessageStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  if(message === null) {
    return null
  } if(message.style === 'error') {
    return <div style={errorMessageStyle}>{message.content}</div>
  }

  return <div style={messageStyle}>{message.content}</div>
}

export default Notification