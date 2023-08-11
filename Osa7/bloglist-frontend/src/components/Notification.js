import { Alert } from "@mui/material"
import { useSelector } from "react-redux"

const Notification = () => {
  const message = useSelector((state) => state.notification)

  if (message === null) {
    return null
  }
  if (message.style === 'error') {
    return (
      <div>
        <Alert severity="error">{message.content}</Alert>
      </div>
    )
  }
  
  return (
    <div>
      <Alert severity="success">{message.content}</Alert>
    </div>
  )
}

export default Notification
