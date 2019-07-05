import {JetView} from "webix-jet";
import {contacts} from "../models/contactsdata";
import ContactsList from "./contacts/contactslist";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{ $subview: true }
			],
			// on: {
			// 	onIdChange: (oldid, newid) => {
			// 		console.log(oldid, newid);
			// 		this.$$("list").select(newid);
			// 	}
			// }
		};
	}
	
	init() {
		contacts.waitData.then(() => {
			this.show("/top/contacts/contactinfo").then();
		});

		this.on(this.app, "contactinfo:show", (id) => {
			this.show("/top/contacts/contactinfo").then(() => {
				this.setParam("id", id, true);
			});
		});

		this.on(this.app, "contactform:show", (mode) => {
			this.show("contactform").then(() => {
				this.setParam("mode", mode);
			});
		});
	}

	destroy() {
		this.app.detachEvent("activities:save");
		this.app.detachEvent("activities:delete");
	}
}