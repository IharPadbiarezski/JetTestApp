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

	ready(view) {
		this.list = view.queryView("list");
	}
	
	init() {

		this.on(this.app, "contactinfo:show", (id) => {
			this.list.enable();
			this.show(`/top/contacts?id=${id}/contactinfo`);
		});

		this.on(this.app, "contactform:show", (flag) => {
			this.list.unselect();
			this.list.disable();
			if (flag) {
				this.show("/top/contacts/contactform");
			} else {
				this.show("contactform");
			}
		});
	}
}