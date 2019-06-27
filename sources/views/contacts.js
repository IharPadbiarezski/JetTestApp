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

	showForm(data, nameHead, nameButton) {
		this.show("contactform", {target:"right"});
		let promise = new Promise((resolve) => {
			let refreshIntervalId = setInterval(() => {
				if (webix.$$("header:contactform") && webix.$$("save:contactform")) {
					resolve();
					clearInterval(refreshIntervalId);
				}
			}, 1);
		});
		promise.then(() => {
			webix.$$("header:contactform").setValues({value: `${nameHead} contact`});
			webix.$$("save:contactform").setValue(nameButton);}
		);
	}
	
	getSelected(){
		return this.getRoot().queryView({view:"list"}).getSelectedId();
	}
}