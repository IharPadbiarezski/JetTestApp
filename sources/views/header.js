// var header = {
// 	type:"header", template:this.app.config.name, css:"webix_header app_header"
// };
import {JetView} from "webix-jet";

export default class HeaderView extends JetView {
	config(){

		return {
			view: "label",
			label: "JetTestApp"
		};
	}

}