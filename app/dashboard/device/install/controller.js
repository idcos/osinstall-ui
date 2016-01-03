import Ember from 'ember';
const {
  get,
  set,
  computed
} = Ember;

export default Ember.Controller.extend({
	isShowMultiSearchBlock:false, //是否显示复杂查询区块
	actions:{
		showMultiSearchBlockAction:function(){
			set(this,'isShowMultiSearchBlock',true);
		},
		hideMultiSearchBlockAction:function(){
			set(this,'isShowMultiSearchBlock',false);
		}
	}
});
