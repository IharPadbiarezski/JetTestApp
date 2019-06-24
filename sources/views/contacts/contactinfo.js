import {JetView} from "webix-jet";


export default class ContactInfo extends JetView{
	config(){
		return { 
			cols: [
				{view: "template", template: "Name Saurname"},
				{view: "template", template: "Template icons"},
				{view: "template", template: "Buttons"}
			]
		};
	}
    


	init(){
		
	}
}