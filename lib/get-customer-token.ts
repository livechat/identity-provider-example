import fetch from 'isomorphic-fetch'
import cookie from 'set-cookie-parser'

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
  tokenType: string
  cst: string
}

export async function getCustomerToken(options: Options): Promise<TokenResult> {
  const { licenseId, redirectUri, clientId, serverAddress, entityId, cst } = options

  const resp = await fetch(`${serverAddress}/customer/token`, {
    method: 'POST',
    headers: {
      cookie: entityId && cst ? `__lc_cid=${entityId};__lc_cst=${cst}` : '',
    },
    body: JSON.stringify({
      grant_type: 'cookie',
      response_type: 'token',
      client_id: clientId,
      redirect_uri: redirectUri,
      license_id: Number(licenseId),
    }),
  })

  const data = await resp.json()
  const { __lc_cst } = cookie.parse(cookie.splitCookiesString(resp.headers.get('set-cookie')!), { map: true })

  return {
    expiresIn: data.expires_in,
    entityId: data.entity_id,
    accessToken: data.access_token,
    tokenType: data.token_type,
    cst: __lc_cst.value,
  }
}
