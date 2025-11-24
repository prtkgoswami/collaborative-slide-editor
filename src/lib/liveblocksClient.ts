import {createClient} from '@liveblocks/client'

export const liveblocksClient = createClient({
    publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY
})