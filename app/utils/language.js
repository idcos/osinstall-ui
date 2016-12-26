export default function language() {
	var language = "zh-CN"
	if(typeof window.sessionStorage === 'undefined'){
    	return language;
    }
 
	language = window.sessionStorage.getItem("osinstallLanguage") || language;
 
    return language;
}
