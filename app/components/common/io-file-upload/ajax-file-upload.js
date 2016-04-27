/**
 * request
 */
import ajaxRequest from './request';

const now = +(new Date());
let index = 0;

/**
 * [uid description]
 * @return {[type]} [description]
 */
function uid() {
  return now + '-' + (++index);
}

const $ = window.$;

/**
 * [request description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 *
 *
 *  option {
 *  	// form action url
 *      url: '',
 *      
 *      // input file element
 *      fileElement: Element,
 *
 * 		// key-value pairs extra data
 * 		data: {},
 *
 * 		// domain if crosseddomain, default document.domain
 * 		domain: '',
 *
 * 		// timeout
 * 		timeout: 100,
 *
 * 		// onprogress only support in modern browser
 *   	onProgress: Function,
 * 
 * 		// succss handler
 * 		onSuccess: Function,
 *
 * 		// error handler
 * 		onError: Function
 *
 *		// start handler
 *  	onStart: Function
 *  }
 */
function request(option) {
	option.onStart = option.onStart || nil;
	option.onError = option.onError || nil;
	option.onSuccess = option.onSuccess || nil;
	option.onProgress = option.onProgress || nil;

	const fileElement = option.fileElement;
	if (!fileElement) {
		return option.onError(getError('Not Find fileElement'));
	}

	option.filename = option.filename || $(fileElement).attr('name') || 'file';

	option.onStart();
	if (window.FormData) {
		// console.log('ajax-upload');
		option.action = option.action || option.url;
		option.file = fileElement.files[0];
		return ajaxRequest(option);
	}

	// console.log('iframe-upload');

	option = $.extend({}, $.ajaxSettings, option);
	const domain = option.domain || document.domain;
	const id = uid();
	const $iframe = createIframe(id, domain);
	const $form = createUploadForm(id, option, domain);

	let requestDone = false;


	if (option.timeout > 0) {
		setTimeout(()=> {
			if (!requestDone) {
				uploadCallback("timeout");
			}
		}, option.timeout);
	}

	try {
		if ($form[0].encoding) {
			$form.attr('encoding', 'multipart/form-data');
		} else {
			$form.attr('enctype', 'multipart/form-data');
		}
		$form.submit();
	} catch (e) {
		option.onError(e);
	}

	$iframe.load(uploadCallback);

	/**
	 * [uploadCallback description]
	 * @param  {Boolean} isTimeout [description]
	 * @return {[type]}            [description]
	 */
	function uploadCallback(isTimeout) {
		let xhr = {};

		if (isTimeout === 'timeout') {
			xhr.status = 'Error';
			xhr.msg = 'timeout';
			return option.onError(getError(option, xhr));
		}

		const iframe = $iframe[0];
		try {
            if (iframe.contentWindow) {
                xhr.document = iframe.contentWindow.document;
            } else if (iframe.contentDocument) {
                xhr.document = iframe.contentDocument.document;
            }
        } catch (e) {
            return option.onError(e);
        }

        if (xhr.document) {
        	requestDone = true;
        	try {
    			xhr.response = getUploadHttpData(xhr);
    			option.onSuccess(xhr.response);
        	} catch (e) {
        		option.onError(e);
        	}
        	$iframe.unbind();
        	setTimeout(()=> {
        		try {
	        		$form.remove();
	        		$iframe.remove();
        		} catch (e) {

        		}
        	}, 10);
        }
	}
}

/**
 * [createIframe description]
 * @param  {[type]} id [description]
 * @param  {[type]} src [description]
 * @return {[type]}     [description]
 */
function createIframe(id, domain) {
	const iframeId = `IframeUpload-${id}`;
    // let src = `javascript:void((function(){
    //     var d = document;
    //     d.open();
    //     d.domain='${domain}';
    //     d.write('');
    //     d.close();
    // })())`;
	let iframeHtml = `
	<iframe 
		id="${iframeId}" 
		name="${iframeId}" 
		style="position:fixed; top:-9999px; left:-9999px"
		src="">
	</iframe>`;

    const $iframe = $(iframeHtml);
    $iframe.appendTo(document.body);
    return $iframe;
}


/**
 * [createUploadForm description]
 * @param  {[type]} iframeId      [description]
 * @param  {[type]} fileElement [description]
 * @param  {[type]} data          [description]
 * @return {[type]}               [description]
 */
function createUploadForm(id, option, domain) {
	const fileElement = option.fileElement;
	const iframeId = `IframeUpload-${id}`;
	const formId = `IframeUploadForm-${id}`;
	const fileId = `IframeUploadFile-${id}`;
	const action = option.action || option.url;
	const formHtml = `
		<form 
			action="${action}"
			method="POST"
			name="${formId}"
			id="${formId}"
			enctype="multipart/form-data"
			target="${iframeId}"
			style="position: absolute; left: -9999px; top: -9999px;">
		</form>
	`;
	const $form = $(formHtml);

	/**
	 * data transform into inputs
	 */
	const data = option.data;
	if (data) {
		for (let attr in data) {
			$(`<input type="hidden" name="${attr}" value="${data[attr]}" />`).appendTo($form);
		}
	}

	/**
	 * domain input
	 */
	$(`<input name="_documentDomain" value="${domain}" />`).appendTo($form);

	/**
	 * fileElement
	 * @type {[type]}
	 */
	const $newFile = $(fileElement).clone();
	$(fileElement).attr('id', fileId);
	$(fileElement).before($newFile);
	$(fileElement).appendTo($form);
	$(fileElement).attr('name', option.filename || $(fileElement).attr('name'));
	$form.appendTo('body');

	return $form;
}

/**
 * [getUploadHttpData description]
 * @param  {[type]} xml [description]
 */
function getUploadHttpData(xml) {
 	const doc = xml.document;
 	const script = doc.getElementsByTagName('script')[0];
    if (script && script.parentNode === doc.body) {
        doc.body.removeChild(script);
    }
    return doc.body ? doc.body.innerText : null;
}

/**
 * [getError description]
 * @param  {[type]} option [description]
 * @param  {[type]} msg    [description]
 * @return {[type]}        [description]
 */
function getError(option, xhr) {
  const err = new Error(xhr.msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = option.action;
  return err;
}

/**
 * [nil description]
 * @return {[type]} [description]
 */
function nil(){}

export default request;