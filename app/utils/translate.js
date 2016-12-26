import Ember from 'ember';
import languageFn from 'ui/utils/language';
import cn from 'ui/translations/zh-CN';
import en from 'ui/translations/en-US';
import format from './template';

const {
  get,
  set,
  computed
} = Ember;

export default function translate(key, params) {
	var language = languageFn();
	var str = ''
	if(language === "en-US"){
		str = en[key];
	}else{
		str = cn[key];
	}
	
	if (params) {
		return format(str || '', params);
	} else {
		return str;
	}
}