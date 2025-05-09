import app from "./app"

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})