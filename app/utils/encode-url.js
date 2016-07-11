export default function encodeUrl(url) {
	var result = "";
    try {
        result = encodeURIComponent(url)
    } catch(e) {
        result = escape(url)
    }
    return result
}
