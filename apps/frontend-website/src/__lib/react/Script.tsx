
export function Script ({ type, src, code, async = false, defer = false, cross_origin, integrity, nonce, referrer_policy }) {
	const children = code || void 0

	return <script type={ type } src={ src } async={ async } defer={ defer } crossOrigin={ cross_origin } integrity={ integrity } nonce={ nonce } referrerPolicy={ referrer_policy }>{ children }</script>
}
