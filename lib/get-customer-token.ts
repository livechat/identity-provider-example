import { request } from 'https'

type Options = {
  licenseId: string
  clientId: string
  redirectUri: string
  serverAddress: string
  entityId?: string
  cst?: string
}

type TokenResult = {
  entityId: string
  expiresIn: number
  accessToken: string
  cst: string
}

export async function getCustomerToken(options: Options): Promise<TokenResult> {
  const { licenseId, redirectUri, clientId, serverAddress, entityId, cst } = options

  return new Promise((resolve, reject) => {
    const requestParams = new URLSearchParams({
      response_type: 'token',
      license_id: licenseId,
      redirect_uri: redirectUri,
      client_id: clientId,
    })
    const requestURL = `${serverAddress}/customer?${requestParams}`
    const requestOptions = entityId && cst ? { headers: { cookie: `__lc_cid=${entityId};__lc_cst=${cst}` } } : {}

    const req = request(requestURL, requestOptions, (res) => {
      const redirectURL = new URL(res.headers.location!)
      const params = new URLSearchParams(redirectURL.hash.slice(1))
      const receivedCookies = (res.headers['set-cookie'] ?? []).reduce((acc, cookie) => {
        const [name, value] = cookie.split(';')[0].split('=')
        return { ...acc, [name]: value }
      }, {} as Record<string, string>)

      resolve({
        expiresIn: Number(params.get('expires_in')),
        entityId: params.get('entity_id') as string,
        accessToken: params.get('access_token') as string,
        cst: receivedCookies['__lc_cst'] as string,
      })
    })

    req.once('error', reject)
    req.end()
  })
}
