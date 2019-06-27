import {JetView} from "webix-jet";
import ContactsList from "./contacts/contactslist";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{ $subview: true, name: "right" }
			]
		};
	}
	
	init() {
		this.show("contactinfo", {target:"right"});
	}

	getSelected(){
		return this.getRoot().queryView({view:"list"}).getSelectedId();
	}
}