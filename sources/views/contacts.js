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
		this.show("contactform", {target:"right"}).then(() => {
			webix.$$("header:contactform").setValues({value: `${nameHead} contact`});
			webix.$$("save:contactform").setValue(nameButton);
		});
	}
}