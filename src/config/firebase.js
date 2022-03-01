import admin from 'firebase-admin'

import { readFile } from 'fs/promises'

// const serviceAccount = JSON.parse(
//   await readFile(new URL('./serviceAccountKey.json', import.meta.url))
// )

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii')
    )
  )
})

export default admin
