import {JetView} from "webix-jet";
import ContactsList from "./contacts/contactslist";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{ $subview: true }
			]
		};
	}
	
	init() {

		this.on(this.app, "contactinfo:show", (id) => {
			this.show(`/top/contacts?id=${id}/contactinfo`);
		});

		this.on(this.app, "contactform:show", (flag) => {
			if (flag) {
				this.show("/top/contacts/contactform");
			} else {
				this.show("contactform");
			}
		});
	}
}