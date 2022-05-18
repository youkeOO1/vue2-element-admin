export default function bese64ChangeBlob(data, mime) {
  data = data.split(',')[1]
  data = window.atob(data)
  const arr = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    arr[i] = data[i]
  }
  const blob = new Blob(arr, {
    type: mime
  })
  return blob
}
