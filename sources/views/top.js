import {JetView, plugins} from "webix-jet";
import {menudata} from "../models/menu";



export default class TopView extends JetView{
	config(){
		let header = {
			type:"header", id: "header_app", template: obj => obj.value, css:"webix_header app_header"
		};

		let menu = {
			view:"menu", id:"top:menu", 
			css:"app_menu",
			width:180, layout:"y", select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			data:menudata
		};

		let ui = {
			type:"clean", paddingX:5, css:"app_layout", 
			rows: [
				header,
				{cols:[
					{  paddingX:5, paddingY:10, rows: [ {css:"webix_shadow_medium", rows:[menu]} ]},
					{ type:"wide", paddingY:10, paddingX:5, rows:[
						{ $subview:true } 
					]}
				]}
			]
		};

		return ui;
	}
	init(){
		this.use(plugins.Menu, "top:menu");
	}
	urlChange() {
		let urlTabName = this.getUrl()[1].page;
		this.page = this.capitalize(urlTabName);
		this.$$("header_app").setValues({value: `${this.page}`});
	}

	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}