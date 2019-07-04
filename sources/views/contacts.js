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

	showContactForm(data, name, additionName) {
		this.show("contactform", {target:"right"}).then(() => {
			webix.$$("header:contactform").setValues({value: `${name} contact`});
			if (!additionName) {
				webix.$$("save:contactform").setValue(name);
			} else {
				webix.$$("save:contactform").setValue(additionName);
			}
		});
	}
}