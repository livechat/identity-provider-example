import Head from 'next/head'
import { useEffect } from 'react'

declare let __lc: any
declare const LiveChatWidget: any

export function ChatWidget() {
  useEffect(() => {
    let tokenPromise: Promise<any> | null = null
    const fetchToken = () => {
      tokenPromise = fetch('/api/lc/token')
        .then((resp) => resp.json())
        .then((data) => {
          tokenPromise = null
          return data
        })

      return tokenPromise
    }

    __lc = __lc || {}
    __lc.custom_identity_provider = () => ({
      getToken: () => tokenPromise || fetchToken(),
      getFreshToken: () => Promise.resolve(),
      hasToken: () => Promise.resolve(false),
      invalidate: () => Promise.resolve(),
    })

    LiveChatWidget?.init()
    LiveChatWidget?.call('maximize')

    return () => {
      LiveChatWidget?.call('destroy')
    }
  }, [])

  return (
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.__lc = window.__lc || {};
          window.__lc.license = ${process.env.NEXT_PUBLIC_LC_LICENSE_ID};
          window.__lc.asyncInit = true;
          ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))`,
        }}
      />
    </Head>
  )
}
