import {JetView} from "webix-jet";

export default class HeaderView extends JetView {
	config(){

		return {
			view: "label",
			label: "JetTestApp"
		};
	}

}