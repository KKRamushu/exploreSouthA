import { createAuthClient } from 'better-auth/react'

const authClient = createAuthClient({ baseURL: window.location.origin })

export default authClient
